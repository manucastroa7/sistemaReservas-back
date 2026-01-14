import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class EmployeePayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    employeeId: string;

    @ManyToOne(() => Employee, (employee) => employee.payments, { onDelete: 'CASCADE' })
    employee: Employee;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    date: string; // YYYY-MM-DD

    @Column({ nullable: true })
    concept: string;

    @Column({ nullable: true })
    hotelId: string;

    @CreateDateColumn()
    createdAt: Date;
}
