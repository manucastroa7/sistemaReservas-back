import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService implements OnModuleInit {
    private usersRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    findOne(username: string): Promise<User | undefined>;
    update(id: string, updates: Partial<User>): Promise<User>;
    create(userData: Partial<User>): Promise<User>;
    seedSuperAdmin(): Promise<void>;
    findAll(hotelId?: string): Promise<User[]>;
}
