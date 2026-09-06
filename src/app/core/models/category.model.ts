export type TransactionType = 'Income' | 'Expense';

export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isSystem: boolean;
  subCategories: SubCategory[];
}

export interface CategoryCreate {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface CategoryUpdate {
  name: string;
  color: string;
  icon: string;
}
