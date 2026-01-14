import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ExpenseCategory {
    INSUMOS = 'Insumos',
    SERVICIOS = 'Servicios',
    MANTENIMIENTO = 'Mantenimiento',
    PROVEEDORES = 'Proveedores',
    OTROS = 'Otros'
}

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: string; // YYYY-MM-DD

    @Column({
        type: 'enum',
        enum: ExpenseCategory,
        default: ExpenseCategory.OTROS
    })
    category: ExpenseCategory;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    supplier: string;

    @Column({ nullable: true })
    hotelId: string;

    @CreateDateColumn()
    createdAt: Date;
}
