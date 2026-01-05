
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('maintenance_tasks')
export class MaintenanceTask {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    requestDate: Date;

    @Column({ default: 'pending' })
    status: 'pending' | 'done';

    @ManyToOne(() => Room, (room) => room.maintenanceTasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room: Room;
}
