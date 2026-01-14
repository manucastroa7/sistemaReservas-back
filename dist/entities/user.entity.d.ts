import { Hotel } from './hotel.entity';
import { Role } from './role.entity';
export declare enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    EMPLOYEE = "employee",
    ADMIN_EMPLOYEE = "admin_employee",
    CLEANING_EMPLOYEE = "cleaning_employee",
    MAINTENANCE_EMPLOYEE = "maintenance_employee"
}
export declare class User {
    id: string;
    email: string;
    password?: string;
    role: UserRole;
    hotelId?: string;
    firstName: string;
    lastName: string;
    position: string;
    salary: number;
    paymentDay: string;
    isRegistered: boolean;
    hiringDate: Date;
    hotel: Hotel;
    roleId?: string;
    customRole: Role;
    createdAt: Date;
    updatedAt: Date;
}
