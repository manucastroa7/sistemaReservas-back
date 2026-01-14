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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const guest_entity_1 = require("./guest.entity");
const room_entity_1 = require("./room.entity");
const hotel_entity_1 = require("./hotel.entity");
let Reservation = class Reservation {
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guest_entity_1.Guest, (guest) => guest.reservations, { cascade: ['insert', 'update'], onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'guest_id' }),
    __metadata("design:type", guest_entity_1.Guest)
], Reservation.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "hotelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, (hotel) => hotel.reservations),
    __metadata("design:type", hotel_entity_1.Hotel)
], Reservation.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => room_entity_1.Room, (room) => room.reservations, { cascade: ['insert', 'update'] }),
    (0, typeorm_1.JoinTable)({
        name: 'reservation_rooms',
        joinColumn: { name: 'reservation_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'room_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Reservation.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Reservation.prototype, "checkIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Reservation.prototype, "lastNight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Reservation.prototype, "checkOut", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Reservation.prototype, "pricePerNight", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { default: 0 }),
    __metadata("design:type", Number)
], Reservation.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Array)
], Reservation.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Array)
], Reservation.prototype, "extras", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Reservation.prototype, "isGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Reservation.prototype, "pax", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "commissionRecipient", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { default: 0 }),
    __metadata("design:type", Number)
], Reservation.prototype, "commissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Reservation.prototype, "commissionPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['confirmed', 'cancelled', 'checked-in', 'checked-out', 'maintenance'],
        default: 'confirmed',
    }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('reservations')
], Reservation);
//# sourceMappingURL=reservation.entity.js.map