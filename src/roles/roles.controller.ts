
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Request() req, @Body() createRoleDto: any) {
        const hotelId = req.user.hotelId;
        return this.rolesService.create(createRoleDto, hotelId);
    }

    @Get()
    findAll(@Request() req) {
        const hotelId = req.user.hotelId;
        return this.rolesService.findAll(hotelId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: any) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
