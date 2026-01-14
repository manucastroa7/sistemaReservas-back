import { User } from './user.entity';
import { Reservation } from './reservation.entity';
import { Room } from './room.entity';
import { Guest } from './guest.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { Role } from './role.entity';
export declare class Hotel {
    id: string;
    name: string;
    location: string;
    address: string;
    contactEmail: string;
    phone: string;
    cuit: string;
    web: string;
    city: string;
    province: string;
    country: string;
    createdAt: Date;
    users: User[];
    reservations: Reservation[];
    rooms: Room[];
    guests: Guest[];
    maintenanceTasks: MaintenanceTask[];
    roles: Role[];
    rolePermissions: Record<string, string[]>;
}
