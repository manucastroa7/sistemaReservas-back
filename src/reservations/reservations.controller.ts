import { Controller, Get, Post, Body, Patch, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../entities/reservation.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Get()
  findAll(@Request() req) {
    return this.reservationsService.findAll(req.user.hotelId);
  }

  @Get('occupancy')
  getOccupancy(@Query('date') date: string, @Request() req) {
    if (!date) {
      // Default to tomorrow if not provided? Or throw error. 
      // Let's assume frontend provides it. If not, today.
      const today = new Date().toISOString().split('T')[0];
      return this.reservationsService.getOccupancy(today, req.user.hotelId);
    }
    return this.reservationsService.getOccupancy(date, req.user.hotelId);
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
  create(@Body() reservation: any, @Request() req) {
    return this.reservationsService.create(reservation, req.user.hotelId);
  }

  @Post('block')
  blockRoom(@Body() body: { roomId: number, start: string, end: string, reason: string }, @Request() req) {
    return this.reservationsService.blockRoom(body.roomId, body.start, body.end, body.reason, req.user.hotelId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: Partial<Reservation>) {
    return this.reservationsService.update(id, update);
  }
}
