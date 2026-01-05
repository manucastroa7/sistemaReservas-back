import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';
export declare class GuestsService {
    private guestsRepository;
    constructor(guestsRepository: Repository<Guest>);
    findAll(): Promise<Guest[]>;
    create(guest: Partial<Guest>): Promise<Guest>;
    update(id: string, guest: Partial<Guest>): Promise<void>;
    remove(id: string): Promise<void>;
}
