
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Hotel } from './hotel.entity';

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  dni: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  contactSource: string;

  @OneToMany(() => Reservation, (reservation) => reservation.guest)
  reservations: Reservation[];

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ nullable: true })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.guests)
  hotel: Hotel;
}
