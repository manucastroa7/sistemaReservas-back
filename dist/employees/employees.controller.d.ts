import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(req: any): Promise<import("../entities/employee.entity").Employee[]>;
    findOne(id: string): Promise<import("../entities/employee.entity").Employee>;
    create(data: any, req: any): Promise<import("../entities/employee.entity").Employee>;
    update(id: string, data: any): Promise<void>;
    remove(id: string): Promise<void>;
    getPayments(id: string): Promise<import("../entities/employee-payment.entity").EmployeePayment[]>;
    getSalaryHistory(id: string): Promise<import("../entities/salary-history.entity").SalaryHistory[]>;
    addPayment(id: string, data: any, req: any): Promise<import("../entities/employee-payment.entity").EmployeePayment>;
}
