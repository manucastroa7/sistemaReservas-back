import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }

    async impersonate(hotelId: string) {
        // Find the admin for this hotel
        // We need to inject UsersService or Repository.
        // AuthService already has UsersService injected.
        const users = await this.usersService.findAll(hotelId);
        // Assuming the first user is the admin or filtering for admin
        const admin = users.find(u => u.role === 'admin' || u.role === 'superadmin'); // fallback? No, just admin.

        if (!admin) {
            throw new Error('No admin found for this hotel');
        }

        return this.login(admin);
    }
}
