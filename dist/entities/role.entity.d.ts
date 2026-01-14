import { Hotel } from './hotel.entity';
import { User } from './user.entity';
export declare class Role {
    id: string;
    name: string;
    hotelId: string;
    hotel: Hotel;
    permissions: string[];
    users: User[];
}
