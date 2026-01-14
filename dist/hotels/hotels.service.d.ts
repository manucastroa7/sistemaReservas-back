import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';
export declare class HotelsService implements OnModuleInit {
    private hotelsRepository;
    private dataSource;
    constructor(hotelsRepository: Repository<Hotel>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    seedDefaultHotel(): Promise<void>;
    migrateOrphanData(hotelId: string): Promise<void>;
    create(hotelData: any): Promise<Hotel>;
    findAll(): Promise<Hotel[]>;
    findOne(id: string): Promise<Hotel>;
    update(id: string, updateData: Partial<Hotel>): Promise<void>;
    remove(id: string): Promise<void>;
    getDebugStats(): Promise<{
        hotels: Hotel[];
        data_distribution: any;
    }>;
}
