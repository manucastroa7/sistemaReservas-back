import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { Guest } from '../entities/guest.entity';

@Controller('guests')
export class GuestsController {
    constructor(private readonly guestsService: GuestsService) { }

    @Get()
    findAll() {
        return this.guestsService.findAll();
    }

    @Post()
    create(@Body() guest: Partial<Guest>) {
        return this.guestsService.create(guest);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() guest: Partial<Guest>) {
        return this.guestsService.update(id, guest);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.guestsService.remove(id);
    }
}
