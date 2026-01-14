import { RoomsService } from './rooms.service';
import { Room, RoomStatus } from '../entities/room.entity';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAll(req: any): Promise<Room[]>;
    create(room: Partial<Room>, req: any): Promise<Room>;
    updateStatus(id: string, status: RoomStatus): Promise<void>;
    update(id: string, room: Partial<Room>): Promise<Room>;
    remove(id: string): Promise<void>;
    addMaintenance(id: string, description: string, requestDate?: string): Promise<import("../entities/maintenance-task.entity").MaintenanceTask>;
    updateMaintenance(taskId: string, updates: {
        status?: 'pending' | 'done';
        description?: string;
        requestDate?: string;
    }): Promise<import("../entities/maintenance-task.entity").MaintenanceTask>;
    deleteMaintenance(taskId: string): Promise<void>;
}
