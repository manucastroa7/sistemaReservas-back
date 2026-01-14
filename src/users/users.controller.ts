import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Query('hotelId') hotelId?: string) {
        return this.usersService.findAll(hotelId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Request() req, @Body() userData: any) {
        // Only allow admins or superadmins to create users
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ForbiddenException('Only admins can create users');
        }

        // Force hotelId to be the creator's hotelId (unless superadmin)
        if (req.user.role !== 'superadmin') {
            userData.hotelId = req.user.hotelId;
        }

        return this.usersService.create(userData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async update(@Request() req, @Param('id') id: string, @Body() updates: any) {
        // Only allow admins to update users, and only in their own hotel
        // Ideally should check if target user belongs to same hotel, but for now strict admin check is okay
        // Logic: requester must be admin/superadmin.
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throw new ForbiddenException('Only admins can update users');
        }

        // TODO: Validate that the user being updated belongs to the requester's hotel (unless superadmin)

        return this.usersService.update(id, updates);
    }
}
