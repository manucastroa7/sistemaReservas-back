"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guest_entity_1 = require("../entities/guest.entity");
let GuestsService = class GuestsService {
    constructor(guestsRepository) {
        this.guestsRepository = guestsRepository;
    }
    async findAll(hotelId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = query.search || '';
        const qb = this.guestsRepository.createQueryBuilder('guest')
            .leftJoinAndSelect('guest.reservations', 'reservation')
            .leftJoinAndSelect('reservation.rooms', 'room')
            .where('guest.hotelId = :hotelId', { hotelId });
        if (search) {
            qb.andWhere('(guest.name ILIKE :search OR guest.lastName ILIKE :search OR guest.dni ILIKE :search)', { search: `%${search}%` });
        }
        qb.leftJoin('guest.reservations', 'sortRes');
        qb.groupBy('guest.id, reservation.id, room.id');
        qb.addSelect('MAX(sortRes.checkIn)', 'max_check_in');
        qb.orderBy('max_check_in', 'DESC', 'NULLS LAST');
        const [result, total] = await qb
            .distinct(true)
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const guests = await this.guestsRepository.createQueryBuilder('guest')
            .leftJoinAndSelect('guest.reservations', 'reservation')
            .where('guest.hotelId = :hotelId', { hotelId })
            .andWhere(search ? '(guest.name ILIKE :search OR guest.lastName ILIKE :search OR guest.dni ILIKE :search)' : '1=1', { search: `%${search}%` })
            .getMany();
        const mapped = guests.map(g => {
            const lastRes = g.reservations?.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())[0];
            return {
                ...g,
                lastCheckIn: lastRes ? lastRes.checkIn : null
            };
        });
        mapped.sort((a, b) => {
            if (!a.lastCheckIn)
                return 1;
            if (!b.lastCheckIn)
                return -1;
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
    create(guest, hotelId) {
        return this.guestsRepository.save({ ...guest, hotelId });
    }
    async update(id, guest) {
        await this.guestsRepository.update(id, guest);
    }
    async remove(id) {
        await this.guestsRepository.delete(id);
    }
    async normalizeNames(hotelId) {
        const guests = await this.guestsRepository.find({ where: { hotelId } });
        let count = 0;
        for (const guest of guests) {
            let changed = false;
            const toTitleCase = (str) => {
                if (!str)
                    return str;
                return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
            };
            const newName = toTitleCase(guest.name);
            const newLastName = toTitleCase(guest.lastName);
            const newCity = toTitleCase(guest.city);
            const newProvince = toTitleCase(guest.province);
            const newCountry = toTitleCase(guest.country);
            if (newName !== guest.name) {
                guest.name = newName;
                changed = true;
            }
            if (newLastName !== guest.lastName) {
                guest.lastName = newLastName;
                changed = true;
            }
            if (newCity !== guest.city) {
                guest.city = newCity;
                changed = true;
            }
            if (newProvince !== guest.province) {
                guest.province = newProvince;
                changed = true;
            }
            if (newCountry !== guest.country) {
                guest.country = newCountry;
                changed = true;
            }
            if (changed) {
                await this.guestsRepository.save(guest);
                count++;
            }
        }
        return count;
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guest_entity_1.Guest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GuestsService);
//# sourceMappingURL=guests.service.js.map