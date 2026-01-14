import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
export declare class ExpensesService {
    private expensesRepository;
    constructor(expensesRepository: Repository<Expense>);
    findAll(hotelId: string): Promise<Expense[]>;
    create(data: Partial<Expense>, hotelId: string): Promise<Expense>;
    remove(id: string): Promise<void>;
    getStats(hotelId: string, monthStr: string): Promise<{
        total: number;
        byCategory: {};
    }>;
}
