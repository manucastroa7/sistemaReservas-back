import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';
import { Room } from './room.entity';
import { Guest } from './guest.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { Role } from './role.entity';

@Entity()
export class Hotel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    contactEmail: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    cuit: string;

    @Column({ nullable: true })
    web: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    province: string;

    @Column({ nullable: true })
    country: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => User, (user) => user.hotel)
    users: User[];

    @OneToMany(() => Reservation, (reservation) => reservation.hotel)
    reservations: Reservation[];

    @OneToMany(() => Room, (room) => room.hotel)
    rooms: Room[];

    @OneToMany(() => Guest, (guest) => guest.hotel)
    guests: Guest[];

    @OneToMany(() => MaintenanceTask, (task) => task.hotel)
    maintenanceTasks: MaintenanceTask[];

    @OneToMany(() => Role, (role) => role.hotel)
    roles: Role[];

    @Column({
        type: 'json',
        default: {
            employee: ['dashboard', 'calendar', 'guests', 'rooms', 'orders'], // Default reasonable access
            admin: ['all']
        }
    })
    rolePermissions: Record<string, string[]>;
}
