export declare enum ExpenseCategory {
    INSUMOS = "Insumos",
    SERVICIOS = "Servicios",
    MANTENIMIENTO = "Mantenimiento",
    PROVEEDORES = "Proveedores",
    OTROS = "Otros"
}
export declare class Expense {
    id: string;
    date: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    supplier: string;
    hotelId: string;
    createdAt: Date;
}
