import { Reservation } from './reservation.entity';
export declare class Guest {
    id: string;
    name: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    reservations: Reservation[];
    observations: string;
}
