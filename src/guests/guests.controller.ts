import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { Guest } from '../entities/guest.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('guests')
@UseGuards(AuthGuard('jwt'))
export class GuestsController {
    constructor(private readonly guestsService: GuestsService) { }

    @Get()
    findAll(@Request() req, @Query() query: any) {
        return this.guestsService.findAll(req.user.hotelId, query);
    }

    @Post()
    create(@Body() guest: Partial<Guest>, @Request() req) {
        return this.guestsService.create(guest, req.user.hotelId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() guest: Partial<Guest>) {
        return this.guestsService.update(id, guest);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.guestsService.remove(id);
    }

    @Post('normalize')
    normalize(@Request() req) {
        return this.guestsService.normalizeNames(req.user.hotelId);
    }
}
