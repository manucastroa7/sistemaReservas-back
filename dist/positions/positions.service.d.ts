import { Repository } from 'typeorm';
import { JobPosition } from '../entities/job-position.entity';
export declare class PositionsService {
    private repo;
    constructor(repo: Repository<JobPosition>);
    findAll(): Promise<JobPosition[]>;
    create(data: Partial<JobPosition>): Promise<Partial<JobPosition> & JobPosition>;
    update(id: string, data: Partial<JobPosition>): Promise<JobPosition>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
