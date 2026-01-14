import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(req: any, createRoleDto: any): Promise<import("../entities/role.entity").Role>;
    findAll(req: any): Promise<import("../entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("../entities/role.entity").Role>;
    update(id: string, updateRoleDto: any): Promise<import("../entities/role.entity").Role>;
    remove(id: string): Promise<void>;
}
