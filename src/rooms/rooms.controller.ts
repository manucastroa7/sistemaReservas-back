import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room, RoomStatus } from '../entities/room.entity';

import { AuthGuard } from '@nestjs/passport';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @Get()
    findAll(@Request() req) {
        // req.user is populated by JwtGuard (which should be global or applied here)
        // Ensure user exists (guard should handle), and access hotelId
        return this.roomsService.findAll(req.user.hotelId);
    }

    @Post()
    create(@Body() room: Partial<Room>, @Request() req) {
        return this.roomsService.create(room, req.user.hotelId);
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
