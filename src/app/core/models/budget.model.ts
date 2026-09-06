export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  year: number;
  month: number;
  limitAmount: number;
  spentAmount: number;
  percentageUsed: number;
}

export interface BudgetUpsert {
  categoryId: number;
  year: number;
  month: number;
  limitAmount: number;
}
