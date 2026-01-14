import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Hotel } from './hotel.entity';
import { Role } from './role.entity';

export enum UserRole {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
    ADMIN_EMPLOYEE = 'admin_employee',
    CLEANING_EMPLOYEE = 'cleaning_employee',
    MAINTENANCE_EMPLOYEE = 'maintenance_employee',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string; // Nullable for external auth potentially, but required for local

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EMPLOYEE,
    })
    role: UserRole;

    @Column({ nullable: true })
    hotelId?: string; // For multi-tenancy, specific hotel ID this user belongs to

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    // HR Fields
    @Column({ nullable: true })
    position: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary: number;

    @Column({ nullable: true })
    paymentDay: string; // e.g., "5", "Last Day"

    @Column({ default: false })
    isRegistered: boolean;

    @Column({ nullable: true })
    hiringDate: Date;

    @ManyToOne(() => Hotel, (hotel) => hotel.users, { nullable: true })
    hotel: Hotel;

    @Column({ nullable: true })
    roleId?: string;

    @ManyToOne(() => Role, (role) => role.users, { nullable: true })
    customRole: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
