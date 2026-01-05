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
        const defaultHotel = await this.hotelsRepository.findOne({ where: { name: 'Gran Hotel Avenida' } });
        if (!defaultHotel) {
            console.log('Seeding Default Hotel...');
            const hotel = await this.hotelsRepository.save({
                name: 'Gran Hotel Avenida',
                location: 'Mar del Plata',
                address: 'Calle Falsa 123',
                contactEmail: 'admin@granhotel.com',
            });

            // We need to inject UsersService to seed the admin user, but circular dependency might be an issue.
            // For simplicity in this seed method, we might need a different approach or just let the user create it manually first?
            // User asked for it to be seeded. Let's try to do it properly with UsersService if available, 
            // or just use a repository if we can't easily inject the service here without valid module structure.
            // Ideally HotelsModule shouldn't depend on UsersModule to avoid circularity if UsersModule depends on HotelsModule (which it does for Entity).
            // So we might need to seed this in the AppModule or a separate Seeder service.
            // However, to keep it simple, I'll move the Admin seeding to the UsersService seed method since UsersService already seeds SuperAdmin.
        }
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
}
