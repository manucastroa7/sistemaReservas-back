import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Hotel } from './hotel.entity';

export enum UserRole {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
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

    @ManyToOne(() => Hotel, (hotel) => hotel.users, { nullable: true })
    hotel: Hotel;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
