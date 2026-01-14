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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const hotel_entity_1 = require("../entities/hotel.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.dataSource = dataSource;
    }
    async onModuleInit() {
        await this.seedSuperAdmin();
    }
    async findOne(username) {
        return this.usersRepository.findOne({ where: { email: username }, relations: ['hotel', 'customRole'] });
    }
    async update(id, updates) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        Object.assign(user, updates);
        return this.usersRepository.save(user);
    }
    async create(userData) {
        const newUser = this.usersRepository.create(userData);
        if (userData.password) {
            newUser.password = await bcrypt.hash(userData.password, 10);
        }
        return this.usersRepository.save(newUser);
    }
    async seedSuperAdmin() {
        const superAdminEmail = 'manucastroa7@gmail.com';
        const exists = await this.usersRepository.findOne({ where: { email: superAdminEmail } });
        if (!exists) {
            console.log('Seeding SuperAdmin...');
            const hashedPassword = await bcrypt.hash('Riverplate912', 10);
            await this.usersRepository.save({
                email: superAdminEmail,
                password: hashedPassword,
                role: user_entity_1.UserRole.SUPERADMIN,
                firstName: 'Manu',
                lastName: 'Castro',
            });
            console.log('SuperAdmin created.');
        }
        const hotelAdminEmail = 'granhotelavenida@gmail.com';
        const adminExists = await this.usersRepository.findOne({ where: { email: hotelAdminEmail } });
        if (!adminExists) {
            const hotelRepo = this.dataSource.getRepository(hotel_entity_1.Hotel);
            const hotel = await hotelRepo.findOne({ where: { name: 'Gran Hotel Avenida' } });
            if (hotel) {
                console.log('Seeding Gran Hotel Admin...');
                const hashedPassword = await bcrypt.hash('canecorso1', 10);
                await this.usersRepository.save({
                    email: hotelAdminEmail,
                    password: hashedPassword,
                    role: user_entity_1.UserRole.ADMIN,
                    firstName: 'Admin',
                    lastName: 'Hotel',
                    hotel: hotel,
                    hotelId: hotel.id
                });
                console.log('Gran Hotel Admin created.');
            }
            else {
                console.log('Gran Hotel Avenida not found, skipping admin seed.');
            }
        }
    }
    async findAll(hotelId) {
        if (hotelId) {
            return this.usersRepository.find({ where: { hotelId }, relations: ['hotel', 'customRole'] });
        }
        return this.usersRepository.find({ relations: ['hotel', 'customRole'] });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], UsersService);
//# sourceMappingURL=users.service.js.map