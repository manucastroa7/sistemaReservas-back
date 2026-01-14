import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeePayment } from '../entities/employee-payment.entity';
import { SalaryHistory } from '../entities/salary-history.entity';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
        @InjectRepository(EmployeePayment)
        private paymentsRepository: Repository<EmployeePayment>,
        @InjectRepository(SalaryHistory)
        private salaryHistoryRepository: Repository<SalaryHistory>,
    ) { }

    async findAll(hotelId: string): Promise<Employee[]> {
        return this.employeesRepository.find({
            where: { hotelId },
            order: { firstName: 'ASC' }
        });
    }

    async findOne(id: string): Promise<Employee> {
        return this.employeesRepository.findOne({
            where: { id },
            relations: ['payments']
        });
    }

    async create(data: Partial<Employee>, hotelId: string): Promise<Employee> {
        const employee = this.employeesRepository.create({ ...data, hotelId });
        return this.employeesRepository.save(employee);
    }

    async update(id: string, data: Partial<Employee>): Promise<void> {
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

    async delete(id: string): Promise<void> {
        await this.employeesRepository.delete(id);
    }

    // Payments
    async addPayment(employeeId: string, data: any, hotelId: string): Promise<EmployeePayment> {
        const payment = this.paymentsRepository.create({ ...data, employeeId, hotelId });
        return this.paymentsRepository.save(payment) as unknown as Promise<EmployeePayment>;
    }

    async getPayments(employeeId: string): Promise<EmployeePayment[]> {
        return this.paymentsRepository.find({
            where: { employeeId },
            order: { date: 'DESC' }
        });
    }

    async getSalaryHistory(employeeId: string): Promise<SalaryHistory[]> {
        return this.salaryHistoryRepository.find({
            where: { employeeId },
            order: { changeDate: 'DESC' }
        });
    }
}
