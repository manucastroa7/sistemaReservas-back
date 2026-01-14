import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from '../entities/room.entity';
import { Reservation } from '../entities/reservation.entity';
import { MaintenanceTask } from '../entities/maintenance-task.entity';
import { DataSource } from 'typeorm';
export declare class RoomsService implements OnModuleInit {
    private roomsRepository;
    private reservationsRepository;
    private maintenanceRepository;
    private dataSource;
    constructor(roomsRepository: Repository<Room>, reservationsRepository: Repository<Reservation>, maintenanceRepository: Repository<MaintenanceTask>, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    findAll(hotelId: string): Promise<Room[]>;
    addMaintenanceTask(roomId: number, description: string, requestDate?: string): Promise<MaintenanceTask>;
    updateMaintenanceTask(taskId: string, updates: {
        status?: 'pending' | 'done';
        description?: string;
        requestDate?: Date;
    }): Promise<MaintenanceTask>;
    deleteMaintenanceTask(taskId: string): Promise<void>;
    create(room: Partial<Room>, hotelId: string): Promise<Room>;
    updateStatus(id: number, status: RoomStatus): Promise<void>;
    update(id: number, updates: Partial<Room>): Promise<Room>;
    remove(id: number): Promise<void>;
}
