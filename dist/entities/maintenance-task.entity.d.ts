import { Room } from './room.entity';
export declare class MaintenanceTask {
    id: string;
    description: string;
    createdAt: Date;
    requestDate: Date;
    status: 'pending' | 'done';
    room: Room;
}
