import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() hotelData: any) {
        return this.hotelsService.create(hotelData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.hotelsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hotelsService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.hotelsService.update(id, updateData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hotelsService.remove(id);
    }
    @Post('migrate/:id')
    migrate(@Param('id') id: string) {
        return this.hotelsService.migrateOrphanData(id);
    }

    @Get('debug-stats')
    getDebugStats() {
        return this.hotelsService.getDebugStats();
    }
}
