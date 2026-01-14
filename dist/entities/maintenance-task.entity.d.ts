import { Room } from './room.entity';
import { Hotel } from './hotel.entity';
export declare class MaintenanceTask {
    id: string;
    description: string;
    createdAt: Date;
    requestDate: Date;
    status: 'pending' | 'done';
    room: Room;
    hotelId: string;
    hotel: Hotel;
}
