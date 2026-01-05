import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('occupancy')
  getOccupancy(@Query('date') date: string) {
    if (!date) {
      // Default to tomorrow if not provided? Or throw error. 
      // Let's assume frontend provides it. If not, today.
      const today = new Date().toISOString().split('T')[0];
      return this.reservationsService.getOccupancy(today);
    }
    return this.reservationsService.getOccupancy(date);
  }

  @Get('check-availability')
  async checkAvailability(
    @Query('roomId') roomId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('exclude') exclude?: string
  ) {
    const isAvailable = await this.reservationsService.checkAvailability(Number(roomId), start, end, exclude);
    return { available: isAvailable };
  }

  @Post()
  create(@Body() reservation: any) {
    return this.reservationsService.create(reservation);
  }

  @Post('block')
  blockRoom(@Body() body: { roomId: number, start: string, end: string, reason: string }) {
    return this.reservationsService.blockRoom(body.roomId, body.start, body.end, body.reason);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: Partial<Reservation>) {
    return this.reservationsService.update(id, update);
  }
}
