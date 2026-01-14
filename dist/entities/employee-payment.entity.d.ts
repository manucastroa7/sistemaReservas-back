import { Employee } from './employee.entity';
export declare class EmployeePayment {
    id: string;
    employeeId: string;
    employee: Employee;
    amount: number;
    date: string;
    concept: string;
    hotelId: string;
    createdAt: Date;
}
