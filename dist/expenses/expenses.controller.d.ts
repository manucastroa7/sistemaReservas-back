import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(req: any): Promise<import("../entities/expense.entity").Expense[]>;
    create(data: any, req: any): Promise<import("../entities/expense.entity").Expense>;
    remove(id: string): Promise<void>;
    getStats(req: any, month: string): Promise<{
        total: number;
        byCategory: {};
    }>;
}
