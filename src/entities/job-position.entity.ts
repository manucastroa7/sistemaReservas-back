import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JobPosition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    baseSalary: number;
}
