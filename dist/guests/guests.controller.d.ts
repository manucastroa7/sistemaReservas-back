import { GuestsService } from './guests.service';
import { Guest } from '../entities/guest.entity';
export declare class GuestsController {
    private readonly guestsService;
    constructor(guestsService: GuestsService);
    findAll(): Promise<Guest[]>;
    create(guest: Partial<Guest>): Promise<Guest>;
    update(id: string, guest: Partial<Guest>): Promise<void>;
    remove(id: string): Promise<void>;
}
