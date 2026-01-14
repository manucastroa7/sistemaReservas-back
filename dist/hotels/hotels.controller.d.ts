import { HotelsService } from './hotels.service';
export declare class HotelsController {
    private readonly hotelsService;
    constructor(hotelsService: HotelsService);
    create(hotelData: any): Promise<import("../entities/hotel.entity").Hotel>;
    findAll(): Promise<import("../entities/hotel.entity").Hotel[]>;
    findOne(id: string): Promise<import("../entities/hotel.entity").Hotel>;
    update(id: string, updateData: any): Promise<void>;
    remove(id: string): Promise<void>;
    migrate(id: string): Promise<void>;
    getDebugStats(): Promise<{
        hotels: import("../entities/hotel.entity").Hotel[];
        data_distribution: any;
    }>;
}
