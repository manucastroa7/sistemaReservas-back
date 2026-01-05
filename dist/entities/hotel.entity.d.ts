import { User } from './user.entity';
export declare class Hotel {
    id: string;
    name: string;
    location: string;
    address: string;
    contactEmail: string;
    createdAt: Date;
    users: User[];
}
