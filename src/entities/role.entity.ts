
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Hotel } from './hotel.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    hotelId: string;

    @ManyToOne(() => Hotel, (hotel) => hotel.roles)
    hotel: Hotel;

    @Column('jsonb', { default: [] })
    permissions: string[]; // ['calendar', 'guests', 'rooms', 'expenses', 'reports', 'settings']

    @OneToMany(() => User, (user) => user.customRole)
    users: User[];
}
