import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { GuestsModule } from './guests/guests.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { Room } from './entities/room.entity';
import { Guest } from './entities/guest.entity';
import { Reservation } from './entities/reservation.entity';
import { MaintenanceTask } from './entities/maintenance-task.entity';
import { User } from './entities/user.entity';
import { Hotel } from './entities/hotel.entity';
import { HotelsModule } from './hotels/hotels.module';
import { Role } from './entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { Employee } from './entities/employee.entity';
import { EmployeePayment } from './entities/employee-payment.entity';
import { EmployeesModule } from './employees/employees.module';
import { Expense } from './entities/expense.entity';
import { SalaryHistory } from './entities/salary-history.entity';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Room, Guest, Reservation, MaintenanceTask, User, Hotel, Role, Employee, EmployeePayment, Expense, SalaryHistory],
      synchronize: true, // Desactivar en producción
    }),
    RoomsModule,
    GuestsModule,
    ReservationsModule,
    AuthModule,
    UsersModule,
    HotelsModule,
    RolesModule,
    EmployeesModule,
    ExpensesModule,
  ],
})
export class AppModule { }
