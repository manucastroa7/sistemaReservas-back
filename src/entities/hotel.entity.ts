import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

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

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => User, (user) => user.hotel)
    users: User[];
}
