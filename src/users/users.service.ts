import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Hotel } from '../entities/hotel.entity'; // Import needed for seeding logic
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private dataSource: DataSource,
    ) { }

    async onModuleInit() {
        await this.seedSuperAdmin();
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email: username }, relations: ['hotel', 'customRole'] });
    }

    async update(id: string, updates: Partial<User>): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        Object.assign(user, updates);
        return this.usersRepository.save(user);
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(userData);
        if (userData.password) {
            newUser.password = await bcrypt.hash(userData.password, 10);
        }
        return this.usersRepository.save(newUser);
    }

    async seedSuperAdmin() {
        const superAdminEmail = 'manucastroa7@gmail.com';
        const exists = await this.usersRepository.findOne({ where: { email: superAdminEmail } });
        if (!exists) {
            console.log('Seeding SuperAdmin...');
            const hashedPassword = await bcrypt.hash('Riverplate912', 10);
            await this.usersRepository.save({
                email: superAdminEmail,
                password: hashedPassword,
                role: UserRole.SUPERADMIN,
                firstName: 'Manu',
                lastName: 'Castro',
            });
            console.log('SuperAdmin created.');
        }

        const hotelAdminEmail = 'granhotelavenida@gmail.com';
        const adminExists = await this.usersRepository.findOne({ where: { email: hotelAdminEmail } });
        if (!adminExists) {
            const hotelRepo = this.dataSource.getRepository(Hotel);
            const hotel = await hotelRepo.findOne({ where: { name: 'Gran Hotel Avenida' } });

            if (hotel) {
                console.log('Seeding Gran Hotel Admin...');
                const hashedPassword = await bcrypt.hash('canecorso1', 10);
                await this.usersRepository.save({
                    email: hotelAdminEmail,
                    password: hashedPassword,
                    role: UserRole.ADMIN,
                    firstName: 'Admin',
                    lastName: 'Hotel',
                    hotel: hotel,
                    hotelId: hotel.id
                });
                console.log('Gran Hotel Admin created.');
            } else {
                console.log('Gran Hotel Avenida not found, skipping admin seed.');
            }
        }
    }

    async findAll(hotelId?: string): Promise<User[]> {
        if (hotelId) {
            return this.usersRepository.find({ where: { hotelId }, relations: ['hotel', 'customRole'] });
        }
        return this.usersRepository.find({ relations: ['hotel', 'customRole'] });
    }
}
