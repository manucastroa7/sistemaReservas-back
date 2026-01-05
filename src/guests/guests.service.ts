import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';

@Injectable()
export class GuestsService {
    constructor(
        @InjectRepository(Guest)
        private guestsRepository: Repository<Guest>,
    ) { }

    findAll(): Promise<Guest[]> {
        console.log('🔎 GuestsService.findAll executing...');
        return this.guestsRepository.find({
            relations: ['reservations', 'reservations.rooms'],
            order: { lastName: 'ASC' }
        });
    }

    create(guest: Partial<Guest>): Promise<Guest> {
        return this.guestsRepository.save(guest);
    }

    async update(id: string, guest: Partial<Guest>): Promise<void> {
        await this.guestsRepository.update(id, guest);
    }

    async remove(id: string): Promise<void> {
        await this.guestsRepository.delete(id);
    }
}
