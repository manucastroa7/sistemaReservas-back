import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from '../entities/room.entity';
import { Reservation } from '../entities/reservation.entity'; // Import Reservation
import { MaintenanceTask } from '../entities/maintenance-task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Room, Reservation, MaintenanceTask])], // Add Reservation here
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule { }
