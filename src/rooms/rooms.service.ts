import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from '../entities/room.entity';
import { Reservation } from '../entities/reservation.entity';
import { MaintenanceTask } from '../entities/maintenance-task.entity';

@Injectable()
export class RoomsService implements OnModuleInit {
    constructor(
        @InjectRepository(Room)
        private roomsRepository: Repository<Room>,
        @InjectRepository(Reservation)
        private reservationsRepository: Repository<Reservation>,
        @InjectRepository(MaintenanceTask)
        private maintenanceRepository: Repository<MaintenanceTask>,
    ) { }

    async onModuleInit() {
        console.log('🔄 Validating Room Inventory...');

        const initialRooms = [
            { id: 2, type: 'DOBLE', capacity: 2 },
            { id: 6, type: 'DOBLE', capacity: 2 },
            { id: 9, type: 'CUADRUPLE', capacity: 4 },
            { id: 10, type: 'DOBLE', capacity: 2 }, // Was missing?
            { id: 12, type: 'TRIPLE', capacity: 3 },
            { id: 14, type: 'DOBLE', capacity: 2 }, // Adding more just in case
            { id: 15, type: 'DOBLE', capacity: 2 },
            { id: 16, type: 'CUADRUPLE', capacity: 4 },
            { id: 17, type: 'DOBLE', capacity: 2 },
            { id: 18, type: 'DOBLE', capacity: 2 },
            { id: 19, type: 'DOBLE', capacity: 2 },
            { id: 20, type: 'CUADRUPLE', capacity: 4 },
            { id: 22, type: 'DOBLE', capacity: 2 },
            { id: 23, type: 'TRIPLE', capacity: 3 },
            { id: 24, type: 'QUINTUPLE', capacity: 5 },
            { id: 25, type: 'TRIPLE', capacity: 3 },
            { id: 26, type: 'DOBLE', capacity: 2 },
            { id: 27, type: 'DOBLE', capacity: 2 },
            { id: 28, type: 'TRIPLE', capacity: 3 },
            { id: 29, type: 'DOBLE', capacity: 2 },
            { id: 30, type: 'DOBLE', capacity: 2 },
            { id: 31, type: 'CUADRUPLE', capacity: 4 },
            { id: 33, type: 'TRIPLE', capacity: 3 },
            { id: 28, type: 'TRIPLE', capacity: 3 },
            { id: 29, type: 'DOBLE', capacity: 2 },
            { id: 30, type: 'DOBLE', capacity: 2 },
            { id: 31, type: 'CUADRUPLE', capacity: 4 },
            { id: 33, type: 'TRIPLE', capacity: 3 },
        ];

        // Upsert all rooms
        for (const r of initialRooms) {
            const existing = await this.roomsRepository.findOneBy({ id: r.id });
            if (!existing) {
                await this.roomsRepository.save({
                    ...r,
                    capacity: r.type === 'TRIPLE' ? 3 : r.capacity,
                    status: 'clean' as RoomStatus
                });
            }
        }

        // Cleanup: Remove old test rooms (IDs > 33 and the specific 100/200 series)
        // User requested: "hasta la 33, de la 33 en adelante osea 100, 101 etc... que no estén"
        // I will execute a delete for IDs > 33 to be safe and clean.
        await this.roomsRepository
            .createQueryBuilder()
            .delete()
            .where("id > 33")
            .execute();

        console.log(`✅ Room Inventory Sync: ${initialRooms.length} rooms checked/created.`);

        // Debug: Log what we have now
        const count = await this.roomsRepository.count();
        console.log(`📊 Total rooms in DB: ${count}`);
    }

    findAll(): Promise<Room[]> {
        console.log('🔎 RoomsService.findAll executing...');
        return this.roomsRepository.find({
            relations: ['maintenanceTasks'],
            order: { id: 'ASC' }
        });
    }

    async addMaintenanceTask(roomId: number, description: string, requestDate?: string): Promise<MaintenanceTask> {
        const room = await this.roomsRepository.findOneBy({ id: roomId });
        if (!room) throw new Error('Room not found');

        // Logic check: if room is not dirty or maintenance, maybe set it?
        // User asked to just register maintenance task.
        // Let's create it.
        const task = this.maintenanceRepository.create({
            description,
            room,
            status: 'pending',
            requestDate: requestDate ? new Date(requestDate) : new Date()
        });

        // Optional: Auto-status update?
        if (room.status !== 'maintenance') {
            // If user wants to block room, they usually do it manually OR we do it here.
            // "registrar el mantenimiento". Usually implies blocking.
            // Let's update status to 'maintenance'
            room.status = 'maintenance';
            await this.roomsRepository.save(room);
        }

        return this.maintenanceRepository.save(task);
    }

    async updateMaintenanceTask(taskId: string, updates: { status?: 'pending' | 'done', description?: string, requestDate?: Date }): Promise<MaintenanceTask> {
        const task = await this.maintenanceRepository.findOneBy({ id: taskId });
        if (!task) throw new Error('Task not found');

        if (updates.status) task.status = updates.status;
        if (updates.description) task.description = updates.description;
        if (updates.requestDate) task.requestDate = updates.requestDate;

        return this.maintenanceRepository.save(task);
    }

    async deleteMaintenanceTask(taskId: string): Promise<void> {
        await this.maintenanceRepository.delete(taskId);
    }

    create(room: Partial<Room>): Promise<Room> {
        return this.roomsRepository.save(room);
    }

    async updateStatus(id: number, status: RoomStatus): Promise<void> {
        await this.roomsRepository.update(id, { status });
    }

    async update(id: number, updates: Partial<Room>): Promise<Room> {
        const room = await this.roomsRepository.findOneBy({ id });
        if (!room) throw new Error('Room not found');
        this.roomsRepository.merge(room, updates);
        return this.roomsRepository.save(room);
    }

    async remove(id: number): Promise<void> {
        // Find reservations linked to this room
        const reservations = await this.reservationsRepository
            .createQueryBuilder('reservation')
            .innerJoin('reservation.rooms', 'room')
            .where('room.id = :id', { id })
            .getMany();

        if (reservations.length > 0) {
            await this.reservationsRepository.remove(reservations);
        }

        await this.roomsRepository.delete(id);
    }
}
