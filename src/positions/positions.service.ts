import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosition } from '../entities/job-position.entity';

@Injectable()
export class PositionsService {
    constructor(
        @InjectRepository(JobPosition)
        private repo: Repository<JobPosition>,
    ) { }

    findAll() {
        return this.repo.find({ order: { name: 'ASC' } });
    }

    create(data: Partial<JobPosition>) {
        return this.repo.save(data);
    }

    async update(id: string, data: Partial<JobPosition>) {
        await this.repo.update(id, data);
        return this.repo.findOneBy({ id });
    }

    delete(id: string) {
        return this.repo.delete(id);
    }
}
