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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../entities/room.entity");
const reservation_entity_1 = require("../entities/reservation.entity");
const maintenance_task_entity_1 = require("../entities/maintenance-task.entity");
let RoomsService = class RoomsService {
    constructor(roomsRepository, reservationsRepository, maintenanceRepository) {
        this.roomsRepository = roomsRepository;
        this.reservationsRepository = reservationsRepository;
        this.maintenanceRepository = maintenanceRepository;
    }
    async onModuleInit() {
        console.log('🔄 Validating Room Inventory...');
        const initialRooms = [
            { id: 2, type: 'DOBLE', capacity: 2 },
            { id: 6, type: 'DOBLE', capacity: 2 },
            { id: 9, type: 'CUADRUPLE', capacity: 4 },
            { id: 10, type: 'DOBLE', capacity: 2 },
            { id: 12, type: 'TRIPLE', capacity: 3 },
            { id: 14, type: 'DOBLE', capacity: 2 },
            { id: 15, type: 'DOBLE', capacity: 2 },
            { id: 16, type: 'CUADRUPLE', capacity: 4 },
            { id: 17, type: 'DOBLE', capacity: 2 },
            { id: 18, type: 'DOBLE', capacity: 2 },
            { id: 19, type: 'DOBLE', capacity: 2 },
            { id: 20, type: 'CUADRUPLE', capacity: 4 },
            { id: 22, type: 'DOBLE', capacity: 2 },
            { id: 23, type: 'TRIPLE', capacity: 3 },
            { id: 24, type: 'QUINTUPLE', capacity: 5 },
            { id: 25, type: 'TRIPLE', capacity: 3 },
            { id: 26, type: 'DOBLE', capacity: 2 },
            { id: 27, type: 'DOBLE', capacity: 2 },
            { id: 28, type: 'TRIPLE', capacity: 3 },
            { id: 29, type: 'DOBLE', capacity: 2 },
            { id: 30, type: 'DOBLE', capacity: 2 },
            { id: 31, type: 'CUADRUPLE', capacity: 4 },
            { id: 33, type: 'TRIPLE', capacity: 3 },
            { id: 28, type: 'TRIPLE', capacity: 3 },
            { id: 29, type: 'DOBLE', capacity: 2 },
            { id: 30, type: 'DOBLE', capacity: 2 },
            { id: 31, type: 'CUADRUPLE', capacity: 4 },
            { id: 33, type: 'TRIPLE', capacity: 3 },
        ];
        for (const r of initialRooms) {
            const existing = await this.roomsRepository.findOneBy({ id: r.id });
            if (!existing) {
                await this.roomsRepository.save({
                    ...r,
                    capacity: r.type === 'TRIPLE' ? 3 : r.capacity,
                    status: 'clean'
                });
            }
        }
        await this.roomsRepository
            .createQueryBuilder()
            .delete()
            .where("id > 33")
            .execute();
        console.log(`✅ Room Inventory Sync: ${initialRooms.length} rooms checked/created.`);
        const count = await this.roomsRepository.count();
        console.log(`📊 Total rooms in DB: ${count}`);
    }
    findAll() {
        console.log('🔎 RoomsService.findAll executing...');
        return this.roomsRepository.find({
            relations: ['maintenanceTasks'],
            order: { id: 'ASC' }
        });
    }
    async addMaintenanceTask(roomId, description, requestDate) {
        const room = await this.roomsRepository.findOneBy({ id: roomId });
        if (!room)
            throw new Error('Room not found');
        const task = this.maintenanceRepository.create({
            description,
            room,
            status: 'pending',
            requestDate: requestDate ? new Date(requestDate) : new Date()
        });
        if (room.status !== 'maintenance') {
            room.status = 'maintenance';
            await this.roomsRepository.save(room);
        }
        return this.maintenanceRepository.save(task);
    }
    async updateMaintenanceTask(taskId, updates) {
        const task = await this.maintenanceRepository.findOneBy({ id: taskId });
        if (!task)
            throw new Error('Task not found');
        if (updates.status)
            task.status = updates.status;
        if (updates.description)
            task.description = updates.description;
        if (updates.requestDate)
            task.requestDate = updates.requestDate;
        return this.maintenanceRepository.save(task);
    }
    async deleteMaintenanceTask(taskId) {
        await this.maintenanceRepository.delete(taskId);
    }
    create(room) {
        return this.roomsRepository.save(room);
    }
    async updateStatus(id, status) {
        await this.roomsRepository.update(id, { status });
    }
    async update(id, updates) {
        const room = await this.roomsRepository.findOneBy({ id });
        if (!room)
            throw new Error('Room not found');
        this.roomsRepository.merge(room, updates);
        return this.roomsRepository.save(room);
    }
    async remove(id) {
        const reservations = await this.reservationsRepository
            .createQueryBuilder('reservation')
            .innerJoin('reservation.rooms', 'room')
            .where('room.id = :id', { id })
            .getMany();
        if (reservations.length > 0) {
            await this.reservationsRepository.remove(reservations);
        }
        await this.roomsRepository.delete(id);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(2, (0, typeorm_1.InjectRepository)(maintenance_task_entity_1.MaintenanceTask)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map