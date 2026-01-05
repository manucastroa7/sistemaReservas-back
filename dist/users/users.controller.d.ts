import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(hotelId?: string): Promise<import("../entities/user.entity").User[]>;
}
