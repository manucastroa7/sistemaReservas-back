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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../entities/employee.entity");
const employee_payment_entity_1 = require("../entities/employee-payment.entity");
const salary_history_entity_1 = require("../entities/salary-history.entity");
let EmployeesService = class EmployeesService {
    constructor(employeesRepository, paymentsRepository, salaryHistoryRepository) {
        this.employeesRepository = employeesRepository;
        this.paymentsRepository = paymentsRepository;
        this.salaryHistoryRepository = salaryHistoryRepository;
    }
    async findAll(hotelId) {
        return this.employeesRepository.find({
            where: { hotelId },
            order: { firstName: 'ASC' }
        });
    }
    async findOne(id) {
        return this.employeesRepository.findOne({
            where: { id },
            relations: ['payments']
        });
    }
    async create(data, hotelId) {
        const employee = this.employeesRepository.create({ ...data, hotelId });
        return this.employeesRepository.save(employee);
    }
    async update(id, data) {
        const currentEmployee = await this.findOne(id);
        if (currentEmployee && data.salary && Number(data.salary) !== Number(currentEmployee.salary)) {
            const history = this.salaryHistoryRepository.create({
                employeeId: id,
                previousSalary: currentEmployee.salary,
                newSalary: data.salary,
                reason: 'Actualización Manual'
            });
            await this.salaryHistoryRepository.save(history);
        }
        await this.employeesRepository.update(id, data);
    }
    async delete(id) {
        await this.employeesRepository.delete(id);
    }
    async addPayment(employeeId, data, hotelId) {
        const payment = this.paymentsRepository.create({ ...data, employeeId, hotelId });
        return this.paymentsRepository.save(payment);
    }
    async getPayments(employeeId) {
        return this.paymentsRepository.find({
            where: { employeeId },
            order: { date: 'DESC' }
        });
    }
    async getSalaryHistory(employeeId) {
        return this.salaryHistoryRepository.find({
            where: { employeeId },
            order: { changeDate: 'DESC' }
        });
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_payment_entity_1.EmployeePayment)),
    __param(2, (0, typeorm_1.InjectRepository)(salary_history_entity_1.SalaryHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map