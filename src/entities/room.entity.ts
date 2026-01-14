
import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { Hotel } from './hotel.entity';

export type RoomStatus = 'clean' | 'dirty' | 'maintenance';

@Entity('rooms')
export class Room {
  @PrimaryColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: ['clean', 'dirty', 'maintenance'],
    default: 'clean',
  })
  status: RoomStatus;

  @Column({ nullable: true })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;

  @ManyToMany(() => Reservation, (reservation) => reservation.rooms)
  reservations: Reservation[];

  @OneToMany(() => MaintenanceTask, (task) => task.room, { cascade: true })
  maintenanceTasks: MaintenanceTask[];
}
