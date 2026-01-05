import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { Room } from '../entities/room.entity';
import { Guest } from '../entities/guest.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) { }

  async findAll(): Promise<any[]> {
    const reservations = await this.reservationsRepository.find({
      relations: ['rooms', 'guest'],
      order: { id: 'DESC' }
    });

    return reservations.map(r => ({
      ...r,
      roomId: r.rooms && r.rooms.length > 0 ? r.rooms[0].id : null,
      roomIds: r.rooms ? r.rooms.map(room => room.id) : [],
      // Keep legacy roomId for compatibility if needed, using the first room
      guestId: r.guest ? r.guest.id : null,
    }));
  }

  async create(payload: any): Promise<Reservation | Reservation[]> {
    console.log('📝 Saving Reservation Payload:', JSON.stringify(payload, null, 2));

    // Handle Bulk/Group Reservation
    if (payload.reservations && Array.isArray(payload.reservations)) {
      const groupId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // Simple unique group ID
      const createdReservations = [];

      for (const item of payload.reservations) {
        // Enrich item with guest data from parent payload if needed
        const fullItem = {
          ...item,
          guest: payload.guest, // Assume guest is shared
          groupId: groupId
        };
        // Recursive call for single creation logic
        // Note: We need to wrap it in the expected structure for single create
        const res = await this.create({
          reservation: fullItem,
          guest: payload.guest
        }) as Reservation;
        createdReservations.push(res);
      }
      return createdReservations;
    }

    let reservationData;

    // Flatten nested payload from recursive calls
    if (payload.reservation) {
      reservationData = { ...payload.reservation, guest: payload.guest || payload.reservation.guest };
    } else {
      reservationData = payload;
    }

    // Legacy support check (remove if confirmed unused, but keeping for safety for one version)
    // api.ts now sends flattened { ...reservation, guest }.
    if (reservationData.reservations) {
      delete reservationData.reservations;
    }

    // Ensure ID is undefined if empty string to allow Auto-Gen
    if (reservationData.id === '') delete reservationData.id;

    // Handle Guest Relationship
    if (reservationData.guest) {
      // 1. If ID is empty string, delete it
      if (reservationData.guest.id === '') delete reservationData.guest.id;

      // 2. If NO ID is present (new guest?), check if DNI already exists to avoid Unique Constraint Error
      if (!reservationData.guest.id && reservationData.guest.dni) {
        const existingGuest = await this.reservationsRepository.manager.findOne(Guest, {
          where: { dni: reservationData.guest.dni }
        });
        if (existingGuest) {
          // Use the existing guest's ID to perform an update instead of insert
          reservationData.guest.id = existingGuest.id;
        }
      }
    }

    // Handle Multi-Room Logic
    let roomIds: number[] = [];

    // Support both legacy roomId and new roomIds array
    if (reservationData.roomIds && Array.isArray(reservationData.roomIds)) {
      roomIds = reservationData.roomIds.map(id => Number(id));
    } else if (reservationData.roomId) {
      roomIds = [Number(reservationData.roomId)];
    }

    if (roomIds.length === 0) {
      throw new BadRequestException('At least one room must be selected.');
    }

    // Check Availability for ALL requested rooms
    // We need to ensure NONE of the requested rooms are occupied in the timeframe
    const checkIn = reservationData.checkIn;
    const lastNight = reservationData.lastNight;

    // Fetch existing reservations that overlap with this timeframe
    const conflictingReservations = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.rooms', 'room')
      .where('reservation.status NOT IN (:...statuses)', { statuses: ['cancelled'] }) // Only cancelled are ignored. Checked-out counts as occupied history.
      .andWhere('reservation.checkIn <= :lastNight', { lastNight })
      .andWhere('reservation.lastNight >= :checkIn', { checkIn })
      .andWhere('room.id IN (:...roomIds)', { roomIds })
      .andWhere(reservationData.id ? 'reservation.id != :id' : '1=1', { id: reservationData.id }) // Exclude self if update
      .getMany();

    if (conflictingReservations.length > 0) {
      const occupiedRoomIds = conflictingReservations.flatMap(r => r.rooms.map(room => room.id));
      const doubleBooked = roomIds.filter(id => occupiedRoomIds.includes(id));
      if (doubleBooked.length > 0) {
        throw new BadRequestException(`Room(s) ${doubleBooked.join(', ')} are already occupied for these dates.`);
      }
    }

    // Load Room Entities
    const rooms = await this.roomsRepository.findBy({ id: In(roomIds) });
    reservationData.rooms = rooms;

    // Remove legacy field to avoid TypeORM mapping errors (since we removed the column)
    delete reservationData.roomId;
    delete reservationData.roomIds; // Also remove this as it's not a column, 'rooms' relation handles it.

    return this.reservationsRepository.save(reservationData);
  }

  async update(id: string, update: Partial<Reservation>): Promise<void> {
    await this.reservationsRepository.update(id, update);
  }

  async checkAvailability(roomId: number, start: string, end: string, excludeResId?: string): Promise<boolean> {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const conflicting = await this.reservationsRepository.createQueryBuilder('reservation')
      .leftJoin('reservation.rooms', 'room')
      .where('room.id = :roomId', { roomId })
      .andWhere('reservation.status != :cancelled', { cancelled: 'cancelled' })
      .andWhere(
        '(reservation.checkIn <= :endDate AND reservation.lastNight >= :startDate)',
        { startDate: start, endDate: end }
      )
      .getOne();

    if (conflicting && conflicting.id !== excludeResId) {
      return false; // Occupied
    }
    return true; // Available
  }

  async getOccupancy(date: string): Promise<number> {
    // Count sum of pax for all active reservations satisfying: checkIn <= date AND lastNight >= date
    // Note: If lastNight is inclusive staying night.

    // We select reservations where date is between checkIn and lastNight (inclusive)
    const activeReservations = await this.reservationsRepository.createQueryBuilder('reservation')
      .where('reservation.status IN (:...statuses)', { statuses: ['confirmed', 'checked-in'] })
      .andWhere('reservation.checkIn <= :date', { date })
      .andWhere('reservation.lastNight >= :date', { date })
      .getMany();

    const totalPax = activeReservations.reduce((sum, res) => sum + (res.pax || 1), 0);
    return totalPax;
  }
  async blockRoom(roomId: number, start: string, end: string, reason: string): Promise<Reservation> {
    // 1. Find or Create 'Mantenimiento' Guest
    let maintenanceGuest = await this.reservationsRepository.manager.findOne(Guest, {
      where: { dni: 'MANTENIMIENTO' }
    });

    if (!maintenanceGuest) {
      maintenanceGuest = await this.reservationsRepository.manager.save(Guest, {
        name: 'MANTENIMIENTO',
        lastName: 'BLOQUEO',
        dni: 'MANTENIMIENTO',
        email: 'mantenimiento@system.local',
        phone: '000000'
      });
    }

    // 2. Create Reservation Payload
    const reservationData = {
      guest: maintenanceGuest,
      roomId: roomId.toString(), // Support legacy schema if needed, but 'rooms' relation handles it
      roomIds: [roomId.toString()],
      checkIn: start,
      lastNight: end, // Inclusive
      checkOut: new Date(new Date(end).setDate(new Date(end).getDate() + 1)).toISOString().split('T')[0],
      pricePerNight: 0,
      status: 'maintenance',
      notes: reason
    };

    // 3. Create using main create logic (handles validation)
    // We cast to any because create expects specific payload structure
    const result = await this.create({ reservation: reservationData, guest: maintenanceGuest });
    return Array.isArray(result) ? result[0] : result;
  }
}
