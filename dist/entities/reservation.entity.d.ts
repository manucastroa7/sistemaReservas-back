import { Guest } from './guest.entity';
import { Room } from './room.entity';
export declare class Reservation {
    id: string;
    guest: Guest;
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
