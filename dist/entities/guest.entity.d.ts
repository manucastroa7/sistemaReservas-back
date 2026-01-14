import { Reservation } from './reservation.entity';
import { Hotel } from './hotel.entity';
export declare class Guest {
    id: string;
    name: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    country: string;
    province: string;
    city: string;
    contactSource: string;
    reservations: Reservation[];
    observations: string;
    hotelId: string;
    hotel: Hotel;
}
