import { Reservation } from './reservation.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { Hotel } from './hotel.entity';
export type RoomStatus = 'clean' | 'dirty' | 'maintenance';
export declare class Room {
    id: number;
    type: string;
    capacity: number;
    status: RoomStatus;
    hotelId: string;
    hotel: Hotel;
    reservations: Reservation[];
    maintenanceTasks: MaintenanceTask[];
}
