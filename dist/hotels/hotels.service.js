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
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_entity_1 = require("../entities/hotel.entity");
const bcrypt = require("bcrypt");
let HotelsService = class HotelsService {
    constructor(hotelsRepository, dataSource) {
        this.hotelsRepository = hotelsRepository;
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        await this.seedDefaultHotel();
    }
    async seedDefaultHotel() {
        const defaultHotel = await this.hotelsRepository.findOne({ where: { name: 'Gran Hotel Avenida' } });
        if (!defaultHotel) {
            console.log('Seeding Default Hotel...');
            const hotel = await this.hotelsRepository.save({
                name: 'Gran Hotel Avenida',
                location: 'Mar del Plata',
                address: 'Calle Falsa 123',
                contactEmail: 'admin@granhotel.com',
            });
        }
    }
    async create(hotelData) {
        const { name, location, address, email, password } = hotelData;
        const newHotel = this.hotelsRepository.create({ name, location, address, contactEmail: email });
        const savedHotel = await this.hotelsRepository.save(newHotel);
        if (email && password) {
            const userRepo = this.dataSource.getRepository('User');
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            await userRepo.save({
                email,
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: name,
                hotel: savedHotel,
                hotelId: savedHotel.id
            });
        }
        return savedHotel;
    }
    async findAll() {
        return this.hotelsRepository.find();
    }
    async findOne(id) {
        return this.hotelsRepository.findOne({ where: { id } });
    }
    async update(id, updateData) {
        await this.hotelsRepository.update(id, updateData);
    }
    async remove(id) {
        await this.hotelsRepository.delete(id);
    }
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], HotelsService);
//# sourceMappingURL=hotels.service.js.map