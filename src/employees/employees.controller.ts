import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Get()
    findAll(@Request() req) {
        return this.employeesService.findAll(req.user.hotelId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(id);
    }

    @Post()
    create(@Body() data: any, @Request() req) {
        return this.employeesService.create(data, req.user.hotelId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.employeesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.delete(id);
    }

    @Get(':id/payments')
    async getPayments(@Param('id') id: string) {
        return this.employeesService.getPayments(id);
    }

    @Get(':id/salary-history')
    async getSalaryHistory(@Param('id') id: string) {
        return this.employeesService.getSalaryHistory(id);
    }

    @Post(':id/payments')
    addPayment(@Param('id') id: string, @Body() data: any, @Request() req) {
        return this.employeesService.addPayment(id, data, req.user.hotelId);
    }
}
