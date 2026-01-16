import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosition } from '../entities/job-position.entity';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([JobPosition])],
    providers: [PositionsService],
    controllers: [PositionsController],
})
export class PositionsModule { }
