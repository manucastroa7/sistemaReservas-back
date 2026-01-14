import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Get()
    findAll(@Request() req) {
        return this.expensesService.findAll(req.user.hotelId);
    }

    @Post()
    create(@Body() data: any, @Request() req) {
        return this.expensesService.create(data, req.user.hotelId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.expensesService.remove(id);
    }

    @Get('stats')
    getStats(@Request() req, @Query('month') month: string) {
        // month YYYY-MM
        return this.expensesService.getStats(req.user.hotelId, month);
    }
}
