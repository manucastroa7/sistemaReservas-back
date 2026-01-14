import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeePayment } from '../entities/employee-payment.entity';
import { SalaryHistory } from '../entities/salary-history.entity';
export declare class EmployeesService {
    private employeesRepository;
    private paymentsRepository;
    private salaryHistoryRepository;
    constructor(employeesRepository: Repository<Employee>, paymentsRepository: Repository<EmployeePayment>, salaryHistoryRepository: Repository<SalaryHistory>);
    findAll(hotelId: string): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    create(data: Partial<Employee>, hotelId: string): Promise<Employee>;
    update(id: string, data: Partial<Employee>): Promise<void>;
    delete(id: string): Promise<void>;
    addPayment(employeeId: string, data: any, hotelId: string): Promise<EmployeePayment>;
    getPayments(employeeId: string): Promise<EmployeePayment[]>;
    getSalaryHistory(employeeId: string): Promise<SalaryHistory[]>;
}
