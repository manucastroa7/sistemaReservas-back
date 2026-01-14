import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HotelsService implements OnModuleInit {
    constructor(
        @InjectRepository(Hotel)
        private hotelsRepository: Repository<Hotel>,
        private dataSource: DataSource,
    ) { }

    async onModuleInit() {
        await this.seedDefaultHotel();
    }

    async seedDefaultHotel() {
        let targetHotel = await this.hotelsRepository.findOne({ where: { name: 'Gran Hotel Avenida' } });
        if (!targetHotel) {
            console.log('Seeding Default Hotel...');
            targetHotel = await this.hotelsRepository.save({
                name: 'Gran Hotel Avenida',
                location: 'Mar del Plata',
                address: 'Calle Falsa 123',
                contactEmail: 'admin@granhotel.com',
            });
        }

        // Always attempt migration of orphan data
        await this.migrateOrphanData(targetHotel.id);
    }

    async migrateOrphanData(hotelId: string) {
        console.log(`🔄 Checking for orphan data to assign to Hotel ID: ${hotelId}`);
        const tables = ['rooms', 'reservations', 'guests', 'maintenance_tasks', 'user']; // 'user' table name is "user" in Postgres

        for (const table of tables) {
            // Quote table name specifically for 'user'
            const tableName = table === 'user' ? '"user"' : table;
            const result: any = await this.dataSource.query(
                `UPDATE ${tableName} SET "hotelId" = $1 WHERE "hotelId" IS NULL`,
                [hotelId]
            );
            // Result structure depends on driver. Postgres usually returns [ [], count ] or similar.
            // TypeORM query result for update is usually [affected_rows, meta] or similar.
            console.log(`   - Migrated ${table}:`, result);
        }
        console.log('✅ Data Migration Check Completed.');
    }

    async create(hotelData: any): Promise<Hotel> {
        const { name, location, address, email, password } = hotelData;

        const newHotel = this.hotelsRepository.create({ name, location, address, contactEmail: email });
        const savedHotel = await this.hotelsRepository.save(newHotel);

        if (email && password) {
            const userRepo = this.dataSource.getRepository('User');
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            await userRepo.save({
                email,
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: name,
                hotel: savedHotel,
                hotelId: savedHotel.id
            });
        }
        return savedHotel;
    }

    async findAll(): Promise<Hotel[]> {
        return this.hotelsRepository.find();
    }

    async findOne(id: string): Promise<Hotel> {
        return this.hotelsRepository.findOne({ where: { id } });
    }

    async update(id: string, updateData: Partial<Hotel>): Promise<void> {
        await this.hotelsRepository.update(id, updateData);
    }

    async remove(id: string): Promise<void> {
        await this.hotelsRepository.delete(id);
    }

    async getDebugStats() {
        const hotels = await this.hotelsRepository.find();

        const counts: any = {};
        const tables = ['rooms', 'guests', 'reservations', 'user'];

        for (const table of tables) {
            const tableName = table === 'user' ? '"user"' : table;
            const res = await this.dataSource.query(`SELECT "hotelId", COUNT(*) as count FROM ${tableName} GROUP BY "hotelId"`);
            counts[table] = res;
        }

        return {
            hotels,
            data_distribution: counts
        };
    }
}
