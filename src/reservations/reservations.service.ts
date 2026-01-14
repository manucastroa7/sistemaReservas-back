import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

  async findAll(hotelId: string): Promise<any[]> {
    console.log(`ReservationsService.findAll asking for hotelId: ${hotelId}`);
    const reservations = await this.reservationsRepository.find({
      where: { hotel: { id: hotelId } },
      relations: ['rooms', 'guest'],
      order: { id: 'DESC' }
    });
    console.log(`Found ${reservations.length} reservations.`);

    return reservations.map(r => ({
      ...r,
      // Helper fields for frontend compatibility
      roomId: r.rooms && r.rooms.length > 0 ? r.rooms[0].id : null,
      roomIds: r.rooms ? r.rooms.map(room => room.id) : [],
      guestId: r.guest ? r.guest.id : null,
    }));
  }

  async create(payload: any, hotelId: string): Promise<Reservation | Reservation[]> {
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
        const res = await this.create({
          reservation: fullItem,
          guest: payload.guest
        }, hotelId) as Reservation;
        createdReservations.push(res);
      }
      return createdReservations;
    }

    let reservationData;

    // Flatten nested payload from recursive calls or direct calls
    if (payload.reservation) {
      reservationData = { ...payload.reservation, guest: payload.guest || payload.reservation.guest };
    } else {
      reservationData = payload;
    }

    // Clean up payload structure
    if (reservationData.reservations) delete reservationData.reservations;
    if (reservationData.id === '') delete reservationData.id;
    if (reservationData.guestId === '') delete reservationData.guestId; // Ensure empty guestId is removed

    // Explicitly remove guestId to rely on relation
    delete reservationData.guestId;

    // Handle Guest Relationship
    if (reservationData.guest) {
      if (typeof reservationData.guest.id === 'string' && reservationData.guest.id === '') {
        delete reservationData.guest.id;
      }

      // Ensure guest has hotelId if new
      if (!reservationData.guest.id) {
        reservationData.guest.hotelId = hotelId;
      }

      if (!reservationData.guest.id && reservationData.guest.dni) {
        const existingGuest = await this.reservationsRepository.manager.findOne(Guest, {
          where: { dni: reservationData.guest.dni }
        });
        if (existingGuest) {
          console.log(`Found existing guest: ${existingGuest.name} ${existingGuest.lastName}`);
          reservationData.guest = existingGuest; // Use the entire existing entity
        }
      }
    }

    // Handle Multi-Room Logic
    let roomIds: number[] = [];
    if (reservationData.roomIds && Array.isArray(reservationData.roomIds)) {
      roomIds = reservationData.roomIds.map((id: any) => Number(id));
    } else if (reservationData.roomId) {
      roomIds = [Number(reservationData.roomId)];
    }

    if (roomIds.length === 0) {
      throw new BadRequestException('At least one room must be selected.');
    }

    // Check Availability
    const checkIn = reservationData.checkIn;
    const lastNight = reservationData.lastNight;

    const conflictingReservations = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.rooms', 'room')
      .where('reservation.status NOT IN (:...statuses)', { statuses: ['cancelled'] })
      .andWhere('reservation.checkIn <= :lastNight', { lastNight })
      .andWhere('reservation.lastNight >= :checkIn', { checkIn })
      .andWhere('room.id IN (:...roomIds)', { roomIds })
      .andWhere(reservationData.id ? 'reservation.id != :id' : '1=1', { id: reservationData.id })
      .andWhere('reservation.hotelId = :hotelId', { hotelId })
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

    // Cleanup legacy fields
    delete reservationData.roomId;
    delete reservationData.roomIds;

    reservationData.hotelId = hotelId;

    const savedReservation = await this.reservationsRepository.save(reservationData);
    console.log('✅ Reservation Saved:', savedReservation.id);
    return savedReservation;
  }

  async update(id: string, update: Partial<Reservation>): Promise<void> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['rooms']
    });

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    // Check availability if reactivating
    if (update.status === 'confirmed' && reservation.status === 'cancelled') {
      console.log('🔄 Attempting to REACTIVATE reservation:', id);
      const roomIds = reservation.rooms.map(r => r.id);

      const conflictingReservations = await this.reservationsRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.rooms', 'room')
        .where('reservation.status NOT IN (:...statuses)', { statuses: ['cancelled'] })
        .andWhere('reservation.checkIn <= :lastNight', { lastNight: reservation.lastNight })
        .andWhere('reservation.lastNight >= :checkIn', { checkIn: reservation.checkIn })
        .andWhere('room.id IN (:...roomIds)', { roomIds })
        .andWhere('reservation.id != :id', { id })
        .getMany();

      if (conflictingReservations.length > 0) {
        console.warn('❌ Reactivation Blocked: Room occupied');
        throw new BadRequestException('No se puede reactivar: Habitación ocupada en estas fechas.');
      }
    }

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
      return false;
    }
    return true;
  }

  async getOccupancy(date: string, hotelId: string): Promise<number> {
    const activeReservations = await this.reservationsRepository.createQueryBuilder('reservation')
      .where('reservation.status IN (:...statuses)', { statuses: ['confirmed', 'checked-in'] })
      .andWhere('reservation.hotelId = :hotelId', { hotelId })
      .andWhere('reservation.checkIn <= :date', { date })
      .andWhere('reservation.lastNight >= :date', { date })
      .getMany();

    const totalPax = activeReservations.reduce((sum, res) => sum + (res.pax || 1), 0);
    return totalPax;
  }

  async blockRoom(roomId: number, start: string, end: string, reason: string, hotelId: string): Promise<Reservation> {
    let maintenanceGuest = await this.reservationsRepository.manager.findOne(Guest, {
      where: { dni: 'MANTENIMIENTO' }
    });

    if (!maintenanceGuest) {
      maintenanceGuest = await this.reservationsRepository.manager.save(Guest, {
        name: 'MANTENIMIENTO',
        lastName: 'BLOQUEO',
        dni: 'MANTENIMIENTO',
        email: 'mantenimiento@system.local',
        phone: '000000',
        hotelId
      });
    }

    const reservationData = {
      guest: maintenanceGuest,
      roomId: roomId.toString(),
      roomIds: [roomId.toString()],
      checkIn: start,
      lastNight: end,
      checkOut: new Date(new Date(end).setDate(new Date(end).getDate() + 1)).toISOString().split('T')[0],
      pricePerNight: 0,
      status: 'maintenance',
      notes: reason
    };

    const result = await this.create({ reservation: reservationData, guest: maintenanceGuest }, hotelId);
    return Array.isArray(result) ? result[0] : result;
  }
}
