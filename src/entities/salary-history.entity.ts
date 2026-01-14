import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class SalaryHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    previousSalary: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    newSalary: number;

    @CreateDateColumn()
    changeDate: Date;

    @Column({ nullable: true })
    reason: string;

    @Column()
    employeeId: string;

    @ManyToOne(() => Employee, (employee) => employee.salaryHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;
}
