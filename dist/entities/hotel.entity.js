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
exports.Hotel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const reservation_entity_1 = require("./reservation.entity");
const room_entity_1 = require("./room.entity");
const guest_entity_1 = require("./guest.entity");
const maintenance_task_entity_1 = require("./maintenance-task.entity");
const role_entity_1 = require("./role.entity");
let Hotel = class Hotel {
};
exports.Hotel = Hotel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Hotel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hotel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "web", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hotel.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Hotel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "reservations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, (room) => room.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => guest_entity_1.Guest, (guest) => guest.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "guests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => maintenance_task_entity_1.MaintenanceTask, (task) => task.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "maintenanceTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => role_entity_1.Role, (role) => role.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'json',
        default: {
            employee: ['dashboard', 'calendar', 'guests', 'rooms', 'orders'],
            admin: ['all']
        }
    }),
    __metadata("design:type", Object)
], Hotel.prototype, "rolePermissions", void 0);
exports.Hotel = Hotel = __decorate([
    (0, typeorm_1.Entity)()
], Hotel);
//# sourceMappingURL=hotel.entity.js.map