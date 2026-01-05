import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { Room } from '../entities/room.entity';
export declare class ReservationsService {
    private reservationsRepository;
    private roomsRepository;
    constructor(reservationsRepository: Repository<Reservation>, roomsRepository: Repository<Room>);
    findAll(): Promise<any[]>;
    create(payload: any): Promise<Reservation | Reservation[]>;
    update(id: string, update: Partial<Reservation>): Promise<void>;
    checkAvailability(roomId: number, start: string, end: string, excludeResId?: string): Promise<boolean>;
    getOccupancy(date: string): Promise<number>;
    blockRoom(roomId: number, start: string, end: string, reason: string): Promise<Reservation>;
}
