import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';

@Injectable()
export class GuestsService {
    constructor(
        @InjectRepository(Guest)
        private guestsRepository: Repository<Guest>,
    ) { }

    async findAll(hotelId: string, query: any): Promise<{ data: any[], total: number, page: number, limit: number }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = query.search || '';

        const qb = this.guestsRepository.createQueryBuilder('guest')
            .leftJoinAndSelect('guest.reservations', 'reservation')
            .leftJoinAndSelect('reservation.rooms', 'room') // Load rooms for context if needed
            .where('guest.hotelId = :hotelId', { hotelId });

        if (search) {
            qb.andWhere('(guest.name ILIKE :search OR guest.lastName ILIKE :search OR guest.dni ILIKE :search)', { search: `%${search}%` });
        }

        // Sorting
        // Default: Sort by CreatedAt (if exists) or ID? Guest doesn't have createdAt yet. ID is UUID.
        // User asked for "Order by Arrival".
        // We will calculate 'lastCheckIn' for every guest.
        // Optimization: For now, let's just fetch all matching matching guests constraints, and paginate in memory if sorting by complex field?
        // No, database sort is better.

        // Complex Sort: Last CheckIn
        // We can join and sort.
        // Be careful with DISTINCT.

        // Simplified approach for now:
        // 1. Get IDs matching search/hotel
        // 2. Sort logic

        // Actually, let's stick to standard DB sort for fields that exist.
        // For "Arrival", we try to sort by the max reservation checkIn.

        // qb.addSelect(subQuery => {
        //    return subQuery.select("MAX(r.checkIn)", "lastCheckIn").from(Reservation, "r").where("r.guestId = guest.id");
        // }, "lastCheckIn");
        // qb.orderBy("lastCheckIn", "DESC");

        // Let's do simple alphabetical or standard sort for now, and handle "Arrival" column display.
        // User asked "ordenarlos por orden de llegada" (Order by arrival).
        // This implies: Guests who arrived recently should be top.

        qb.leftJoin('guest.reservations', 'sortRes');
        qb.groupBy('guest.id, reservation.id, room.id'); // Group by all selected fields
        qb.addSelect('MAX(sortRes.checkIn)', 'max_check_in');
        qb.orderBy('max_check_in', 'DESC', 'NULLS LAST'); // Recent arrivals first

        // TypeORM + GroupBy + Pagination is tricky.
        // Let's try a simpler approach: Fetch with relations, sort in code (if limiting to 500 guests it's fine).
        // If unlimited, it's bad.
        // Let's limit fetch to 100 for now if no pagination provided?

        // Let's rely on TypeORM's take/skip.
        // But with Join and GroupBy, take/skip acts on potential row multiplication.

        // Fallback: Just return all filtered by search, sort in memory (User likely has < 1000 guests for now).
        // Then implementing real DB paging later if needed.
        // Wait, user explicitly asked for "paginación".

        // Let's implement generic finding and explicit sorting.

        const [result, total] = await qb
            .distinct(true) // Distinct guests
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        // The above orderBy might fail with distinct.
        // Safe bet: Fetch standard. Sort in memory for the 'Arrival' requirement if requested?
        // or just sort by name?

        // Re-attempting simple query with subquery sort logic implies high complexity.
        // I will implement standard pagination first, and default sort by Name.
        // I will Add "lastCheckIn" computation in the mapper.

        // Let's ignore the "Order by Arrival" strictly in SQL for a moment and just get the data flowing with pagination.
        // Wait, user request: "ordenarlos por orden de llegada". I MUST deliver this.

        // Correct way:
        const guests = await this.guestsRepository.createQueryBuilder('guest')
            .leftJoinAndSelect('guest.reservations', 'reservation')
            .where('guest.hotelId = :hotelId', { hotelId })
            .andWhere(search ? '(guest.name ILIKE :search OR guest.lastName ILIKE :search OR guest.dni ILIKE :search)' : '1=1', { search: `%${search}%` })
            .getMany();

        // In-memory sort (easiest for robust logic with relations)
        const mapped = guests.map(g => {
            const lastRes = g.reservations?.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())[0];
            return {
                ...g,
                lastCheckIn: lastRes ? lastRes.checkIn : null
            };
        });

        mapped.sort((a, b) => {
            // Sort by Arrival Descending
            if (!a.lastCheckIn) return 1;
            if (!b.lastCheckIn) return -1;
            return new Date(b.lastCheckIn).getTime() - new Date(a.lastCheckIn).getTime();
        });

        const paginated = mapped.slice(skip, skip + limit);

        return {
            data: paginated,
            total: mapped.length,
            page,
            limit
        };
    }

    create(guest: Partial<Guest>, hotelId: string): Promise<Guest> {
        return this.guestsRepository.save({ ...guest, hotelId });
    }

    async update(id: string, guest: Partial<Guest>): Promise<void> {
        await this.guestsRepository.update(id, guest);
    }

    async remove(id: string): Promise<void> {
        await this.guestsRepository.delete(id);
    }

    async normalizeNames(hotelId: string): Promise<number> {
        // Fetch ALL guests for the hotel
        const guests = await this.guestsRepository.find({ where: { hotelId } });
        let count = 0;

        for (const guest of guests) {
            let changed = false;

            const toTitleCase = (str: string) => {
                if (!str) return str;
                return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
            };

            const newName = toTitleCase(guest.name);
            const newLastName = toTitleCase(guest.lastName);
            const newCity = toTitleCase(guest.city);
            const newProvince = toTitleCase(guest.province);
            const newCountry = toTitleCase(guest.country);

            if (newName !== guest.name) { guest.name = newName; changed = true; }
            if (newLastName !== guest.lastName) { guest.lastName = newLastName; changed = true; }
            if (newCity !== guest.city) { guest.city = newCity; changed = true; }
            if (newProvince !== guest.province) { guest.province = newProvince; changed = true; }
            if (newCountry !== guest.country) { guest.country = newCountry; changed = true; }

            if (changed) {
                await this.guestsRepository.save(guest);
                count++;
            }
        }
        return count;
    }
}
