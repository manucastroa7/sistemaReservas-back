"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("../entities/reservation.entity");
const room_entity_1 = require("../entities/room.entity");
const guest_entity_1 = require("../entities/guest.entity");
let ReservationsService = class ReservationsService {
    constructor(reservationsRepository, roomsRepository) {
        this.reservationsRepository = reservationsRepository;
        this.roomsRepository = roomsRepository;
    }
    async findAll() {
        const reservations = await this.reservationsRepository.find({
            relations: ['rooms', 'guest'],
            order: { id: 'DESC' }
        });
        return reservations.map(r => ({
            ...r,
            roomId: r.rooms && r.rooms.length > 0 ? r.rooms[0].id : null,
            roomIds: r.rooms ? r.rooms.map(room => room.id) : [],
            guestId: r.guest ? r.guest.id : null,
        }));
    }
    async create(payload) {
        console.log('📝 Saving Reservation Payload:', JSON.stringify(payload, null, 2));
        if (payload.reservations && Array.isArray(payload.reservations)) {
            const groupId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const createdReservations = [];
            for (const item of payload.reservations) {
                const fullItem = {
                    ...item,
                    guest: payload.guest,
                    groupId: groupId
                };
                const res = await this.create({
                    reservation: fullItem,
                    guest: payload.guest
                });
                createdReservations.push(res);
            }
            return createdReservations;
        }
        let reservationData;
        if (payload.reservation) {
            reservationData = { ...payload.reservation, guest: payload.guest || payload.reservation.guest };
        }
        else {
            reservationData = payload;
        }
        if (reservationData.reservations) {
            delete reservationData.reservations;
        }
        if (reservationData.id === '')
            delete reservationData.id;
        if (reservationData.guest) {
            if (reservationData.guest.id === '')
                delete reservationData.guest.id;
            if (!reservationData.guest.id && reservationData.guest.dni) {
                const existingGuest = await this.reservationsRepository.manager.findOne(guest_entity_1.Guest, {
                    where: { dni: reservationData.guest.dni }
                });
                if (existingGuest) {
                    reservationData.guest.id = existingGuest.id;
                }
            }
        }
        let roomIds = [];
        if (reservationData.roomIds && Array.isArray(reservationData.roomIds)) {
            roomIds = reservationData.roomIds.map(id => Number(id));
        }
        else if (reservationData.roomId) {
            roomIds = [Number(reservationData.roomId)];
        }
        if (roomIds.length === 0) {
            throw new common_1.BadRequestException('At least one room must be selected.');
        }
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
            .getMany();
        if (conflictingReservations.length > 0) {
            const occupiedRoomIds = conflictingReservations.flatMap(r => r.rooms.map(room => room.id));
            const doubleBooked = roomIds.filter(id => occupiedRoomIds.includes(id));
            if (doubleBooked.length > 0) {
                throw new common_1.BadRequestException(`Room(s) ${doubleBooked.join(', ')} are already occupied for these dates.`);
            }
        }
        const rooms = await this.roomsRepository.findBy({ id: (0, typeorm_2.In)(roomIds) });
        reservationData.rooms = rooms;
        delete reservationData.roomId;
        delete reservationData.roomIds;
        return this.reservationsRepository.save(reservationData);
    }
    async update(id, update) {
        await this.reservationsRepository.update(id, update);
    }
    async checkAvailability(roomId, start, end, excludeResId) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const conflicting = await this.reservationsRepository.createQueryBuilder('reservation')
            .leftJoin('reservation.rooms', 'room')
            .where('room.id = :roomId', { roomId })
            .andWhere('reservation.status != :cancelled', { cancelled: 'cancelled' })
            .andWhere('(reservation.checkIn <= :endDate AND reservation.lastNight >= :startDate)', { startDate: start, endDate: end })
            .getOne();
        if (conflicting && conflicting.id !== excludeResId) {
            return false;
        }
        return true;
    }
    async getOccupancy(date) {
        const activeReservations = await this.reservationsRepository.createQueryBuilder('reservation')
            .where('reservation.status IN (:...statuses)', { statuses: ['confirmed', 'checked-in'] })
            .andWhere('reservation.checkIn <= :date', { date })
            .andWhere('reservation.lastNight >= :date', { date })
            .getMany();
        const totalPax = activeReservations.reduce((sum, res) => sum + (res.pax || 1), 0);
        return totalPax;
    }
    async blockRoom(roomId, start, end, reason) {
        let maintenanceGuest = await this.reservationsRepository.manager.findOne(guest_entity_1.Guest, {
            where: { dni: 'MANTENIMIENTO' }
        });
        if (!maintenanceGuest) {
            maintenanceGuest = await this.reservationsRepository.manager.save(guest_entity_1.Guest, {
                name: 'MANTENIMIENTO',
                lastName: 'BLOQUEO',
                dni: 'MANTENIMIENTO',
                email: 'mantenimiento@system.local',
                phone: '000000'
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
        const result = await this.create({ reservation: reservationData, guest: maintenanceGuest });
        return Array.isArray(result) ? result[0] : result;
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map