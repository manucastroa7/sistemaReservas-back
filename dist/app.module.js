"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const rooms_module_1 = require("./rooms/rooms.module");
const guests_module_1 = require("./guests/guests.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const reservations_module_1 = require("./reservations/reservations.module");
const room_entity_1 = require("./entities/room.entity");
const guest_entity_1 = require("./entities/guest.entity");
const reservation_entity_1 = require("./entities/reservation.entity");
const maintenance_task_entity_1 = require("./entities/maintenance-task.entity");
const user_entity_1 = require("./entities/user.entity");
const hotel_entity_1 = require("./entities/hotel.entity");
const hotels_module_1 = require("./hotels/hotels.module");
const role_entity_1 = require("./entities/role.entity");
const roles_module_1 = require("./roles/roles.module");
const employee_entity_1 = require("./entities/employee.entity");
const employee_payment_entity_1 = require("./entities/employee-payment.entity");
const employees_module_1 = require("./employees/employees.module");
const expense_entity_1 = require("./entities/expense.entity");
const salary_history_entity_1 = require("./entities/salary-history.entity");
const expenses_module_1 = require("./expenses/expenses.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [room_entity_1.Room, guest_entity_1.Guest, reservation_entity_1.Reservation, maintenance_task_entity_1.MaintenanceTask, user_entity_1.User, hotel_entity_1.Hotel, role_entity_1.Role, employee_entity_1.Employee, employee_payment_entity_1.EmployeePayment, expense_entity_1.Expense, salary_history_entity_1.SalaryHistory],
                synchronize: true,
            }),
            rooms_module_1.RoomsModule,
            guests_module_1.GuestsModule,
            reservations_module_1.ReservationsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            hotels_module_1.HotelsModule,
            roles_module_1.RolesModule,
            employees_module_1.EmployeesModule,
            expenses_module_1.ExpensesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map