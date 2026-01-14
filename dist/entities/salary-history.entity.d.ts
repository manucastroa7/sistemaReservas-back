import { Employee } from './employee.entity';
export declare class SalaryHistory {
    id: string;
    previousSalary: number;
    newSalary: number;
    changeDate: Date;
    reason: string;
    employeeId: string;
    employee: Employee;
}
