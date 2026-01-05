import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room, RoomStatus } from '../entities/room.entity';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Get()
    findAll() {
        return this.roomsService.findAll();
    }

    @Post()
    create(@Body() room: Partial<Room>) {
        return this.roomsService.create(room);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: RoomStatus) {
        return this.roomsService.updateStatus(+id, status);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() room: Partial<Room>) {
        return this.roomsService.update(+id, room);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.roomsService.remove(+id);
    }

    @Post(':id/maintenance')
    addMaintenance(@Param('id') id: string, @Body('description') description: string, @Body('requestDate') requestDate?: string) {
        return this.roomsService.addMaintenanceTask(+id, description, requestDate);
    }

    @Patch('maintenance/:taskId')
    updateMaintenance(@Param('taskId') taskId: string, @Body() updates: { status?: 'pending' | 'done', description?: string, requestDate?: string }) {
        return this.roomsService.updateMaintenanceTask(taskId, {
            ...updates,
            requestDate: updates.requestDate ? new Date(updates.requestDate) : undefined
        });
    }

    @Delete('maintenance/:taskId')
    deleteMaintenance(@Param('taskId') taskId: string) {
        return this.roomsService.deleteMaintenanceTask(taskId);
    }
}
