import { TransactionType } from './category.model';

export interface MonthSummary {
  year: number;
  month: number;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  netForMonth: number;
  closingBalance: number;
  transactionCount: number;
}

export interface CategoryBreakdownItem {
  categoryId: number;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
}

export type TrendGranularity = 'Daily' | 'Weekly' | 'Monthly';

export interface TrendPoint {
  periodLabel: string;
  periodStart: string;
  income: number;
  expense: number;
  net: number;
}

export interface DashboardQuery {
  year: number;
  month: number;
  type?: TransactionType;
}
