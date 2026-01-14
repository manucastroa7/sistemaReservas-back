import { GuestsService } from './guests.service';
import { Guest } from '../entities/guest.entity';
export declare class GuestsController {
    private readonly guestsService;
    constructor(guestsService: GuestsService);
    findAll(req: any, query: any): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(guest: Partial<Guest>, req: any): Promise<Guest>;
    update(id: string, guest: Partial<Guest>): Promise<void>;
    remove(id: string): Promise<void>;
    normalize(req: any): Promise<number>;
}
