import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';
export declare class GuestsService {
    private guestsRepository;
    constructor(guestsRepository: Repository<Guest>);
    findAll(hotelId: string, query: any): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(guest: Partial<Guest>, hotelId: string): Promise<Guest>;
    update(id: string, guest: Partial<Guest>): Promise<void>;
    remove(id: string): Promise<void>;
    normalizeNames(hotelId: string): Promise<number>;
}
