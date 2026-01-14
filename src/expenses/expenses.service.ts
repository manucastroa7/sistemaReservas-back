import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expensesRepository: Repository<Expense>,
    ) { }

    async findAll(hotelId: string): Promise<Expense[]> {
        return this.expensesRepository.find({
            where: { hotelId },
            order: { date: 'DESC' }
        });
    }

    async create(data: Partial<Expense>, hotelId: string): Promise<Expense> {
        const expense = this.expensesRepository.create({ ...data, hotelId });
        return this.expensesRepository.save(expense);
    }

    async remove(id: string): Promise<void> {
        await this.expensesRepository.delete(id);
    }

    async getStats(hotelId: string, monthStr: string) {
        // monthStr format: YYYY-MM
        const expenses = await this.expensesRepository.createQueryBuilder('expense')
            .where('expense.hotelId = :hotelId', { hotelId })
            .andWhere('expense.date LIKE :month', { month: `${monthStr}%` })
            .getMany();

        const byCategory = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
            return acc;
        }, {});

        const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

        return { total, byCategory };
    }
}
