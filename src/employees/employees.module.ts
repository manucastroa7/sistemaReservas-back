import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from '../entities/employee.entity';
import { EmployeePayment } from '../entities/employee-payment.entity';
import { SalaryHistory } from '../entities/salary-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, EmployeePayment, SalaryHistory])],
    controllers: [EmployeesController],
    providers: [EmployeesService],
    exports: [EmployeesService]
})
export class EmployeesModule { }
