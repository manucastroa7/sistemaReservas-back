
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) { }

    async create(createRoleDto: any, hotelId: string): Promise<Role> {
        const role = this.rolesRepository.create();
        Object.assign(role, createRoleDto);
        role.hotelId = hotelId;
        return this.rolesRepository.save(role);
    }

    async findAll(hotelId: string): Promise<Role[]> {
        return this.rolesRepository.find({
            where: { hotelId }
        });
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    async update(id: string, updateRoleDto: any): Promise<Role> {
        await this.rolesRepository.update(id, updateRoleDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const role = await this.findOne(id);
        await this.rolesRepository.remove(role);
    }
}
