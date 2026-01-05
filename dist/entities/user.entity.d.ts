import { Hotel } from './hotel.entity';
export declare enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    EMPLOYEE = "employee"
}
export declare class User {
    id: string;
    email: string;
    password?: string;
    role: UserRole;
    hotelId?: string;
    firstName: string;
    lastName: string;
    hotel: Hotel;
    createdAt: Date;
    updatedAt: Date;
}
