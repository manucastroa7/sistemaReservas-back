import { ReservationsService } from './reservations.service';
import { Reservation } from '../entities/reservation.entity';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    findAll(req: any): Promise<any[]>;
    getOccupancy(date: string, req: any): Promise<number>;
    checkAvailability(roomId: string, start: string, end: string, exclude?: string): Promise<{
        available: boolean;
    }>;
    create(reservation: any, req: any): Promise<Reservation | Reservation[]>;
    blockRoom(body: {
        roomId: number;
        start: string;
        end: string;
        reason: string;
    }, req: any): Promise<Reservation>;
    update(id: string, update: Partial<Reservation>): Promise<void>;
}
