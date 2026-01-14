import { Hotel } from './hotel.entity';
import { EmployeePayment } from './employee-payment.entity';
import { SalaryHistory } from './salary-history.entity';
export declare class Employee {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    position: string;
    salary: number;
    isRegistered: boolean;
    paymentDay: string;
    hiringDate: Date;
    status: string;
    terminationDate: Date;
    observations: string;
    hotelId: string;
    hotel: Hotel;
    payments: EmployeePayment[];
    salaryHistory: SalaryHistory[];
    createdAt: Date;
    updatedAt: Date;
}
