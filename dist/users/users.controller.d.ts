import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(hotelId?: string): Promise<import("../entities/user.entity").User[]>;
    create(req: any, userData: any): Promise<import("../entities/user.entity").User>;
    update(req: any, id: string, updates: any): Promise<import("../entities/user.entity").User>;
}
