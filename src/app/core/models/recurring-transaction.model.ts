import { TransactionType } from './category.model';

export type RecurrenceFrequency = 'Weekly' | 'Monthly';

export interface RecurringTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  subCategoryId: number | null;
  subCategoryName: string | null;
  note: string | null;
  paymentMethod: string | null;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate: string | null;
  nextRunDate: string;
  isActive: boolean;
}

export interface RecurringTransactionCreate {
  type: TransactionType;
  amount: number;
  categoryId: number;
  subCategoryId: number | null;
  note?: string | null;
  paymentMethod?: string | null;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string | null;
}

export interface RecurringTransactionUpdate extends RecurringTransactionCreate {
  isActive: boolean;
}
