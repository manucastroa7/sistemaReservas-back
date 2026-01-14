import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Hotel } from './hotel.entity';
import { EmployeePayment } from './employee-payment.entity';
import { SalaryHistory } from './salary-history.entity';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    dni: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    position: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary: number;

    @Column({ default: false })
    isRegistered: boolean;

    @Column({ nullable: true })
    paymentDay: string;

    @Column({ nullable: true })
    hiringDate: Date;

    @Column({ default: 'Activo' }) // 'Activo', 'Despedido', 'Renuncio'
    status: string;

    @Column({ nullable: true })
    terminationDate: Date;

    @Column({ type: 'text', nullable: true })
    observations: string;

    @Column({ nullable: true })
    hotelId: string;

    @ManyToOne(() => Hotel, { nullable: true })
    hotel: Hotel;

    @OneToMany(() => EmployeePayment, (payment) => payment.employee)
    payments: EmployeePayment[];

    @OneToMany(() => SalaryHistory, (history) => history.employee)
    salaryHistory: SalaryHistory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
