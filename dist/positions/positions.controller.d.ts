import { PositionsService } from './positions.service';
export declare class PositionsController {
    private service;
    constructor(service: PositionsService);
    findAll(): Promise<import("../entities/job-position.entity").JobPosition[]>;
    create(body: any): Promise<Partial<import("../entities/job-position.entity").JobPosition> & import("../entities/job-position.entity").JobPosition>;
    update(id: string, body: any): Promise<import("../entities/job-position.entity").JobPosition>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
