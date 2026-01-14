import { Guest } from './guest.entity';
import { Room } from './room.entity';
import { Hotel } from './hotel.entity';
export declare class Reservation {
    id: string;
    guest: Guest;
    hotelId: string;
    hotel: Hotel;
    rooms: Room[];
    checkIn: string;
    groupId: string;
    lastNight: string;
    checkOut: string;
    pricePerNight: number;
    discount: number;
    payments: any[];
    extras: any[];
    isGroup: boolean;
    pax: number;
    groupName: string;
    commissionRecipient: string;
    commissionAmount: number;
    commissionPaid: boolean;
    notes: string;
    status: string;
}
