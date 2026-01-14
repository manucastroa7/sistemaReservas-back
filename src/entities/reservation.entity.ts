
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Guest } from './guest.entity';
import { Room } from './room.entity';
import { Hotel } from './hotel.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Guest, (guest) => guest.reservations, { cascade: ['insert', 'update'], onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @Column({ nullable: true })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.reservations)
  hotel: Hotel;

  @ManyToMany(() => Room, (room) => room.reservations, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'reservation_rooms', // Table name for the junction table
    joinColumn: { name: 'reservation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'room_id', referencedColumnName: 'id' },
  })
  rooms: Room[];

  @Column({ type: 'date' })
  checkIn: string;
  @Column({ nullable: true })
  groupId: string; // To link multiple reservations together

  @Column({ type: 'date' })
  lastNight: string;

  @Column({ type: 'date' })
  checkOut: string;

  @Column('decimal')
  pricePerNight: number;

  @Column('decimal', { default: 0 })
  discount: number;

  @Column('jsonb', { default: [] })
  payments: any[];

  @Column('jsonb', { default: [] })
  extras: any[];

  @Column({ default: false })
  isGroup: boolean;

  @Column({ type: 'int', default: 1 })
  pax: number;

  @Column({ nullable: true })
  groupName: string;

  @Column({ nullable: true })
  commissionRecipient: string;

  @Column('decimal', { default: 0 })
  commissionAmount: number;

  @Column({ default: false })
  commissionPaid: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: ['confirmed', 'cancelled', 'checked-in', 'checked-out', 'maintenance'],
    default: 'confirmed',
  })
  status: string;
}
