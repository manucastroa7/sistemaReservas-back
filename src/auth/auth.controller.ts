import { Controller, Post, UseGuards, Request, Get, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('impersonate')
    async impersonate(@Request() req, @Body('hotelId') hotelId: string) {
        // Check if requester is superadmin
        if (req.user.role !== 'superadmin') {
            throw new UnauthorizedException('Only SuperAdmin can impersonate');
        }
        return this.authService.impersonate(hotelId);
    }
}
