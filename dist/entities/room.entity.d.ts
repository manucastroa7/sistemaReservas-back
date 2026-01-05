import { Reservation } from './reservation.entity';
import { MaintenanceTask } from './maintenance-task.entity';
export type RoomStatus = 'clean' | 'dirty' | 'maintenance';
export declare class Room {
    id: number;
    type: string;
    capacity: number;
    status: RoomStatus;
    reservations: Reservation[];
    maintenanceTasks: MaintenanceTask[];
}
