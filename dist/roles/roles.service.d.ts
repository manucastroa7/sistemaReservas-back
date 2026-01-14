import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
export declare class RolesService {
    private rolesRepository;
    constructor(rolesRepository: Repository<Role>);
    create(createRoleDto: any, hotelId: string): Promise<Role>;
    findAll(hotelId: string): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    update(id: string, updateRoleDto: any): Promise<Role>;
    remove(id: string): Promise<void>;
}
