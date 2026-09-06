import { TransactionType } from './category.model';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  amount: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  subCategoryId: number | null;
  subCategoryName: string | null;
  note: string | null;
  paymentMethod: string | null;
  tags: string[];
}

export interface TransactionCreate {
  date: string;
  type: TransactionType;
  amount: number;
  categoryId: number;
  subCategoryId: number | null;
  note?: string | null;
  paymentMethod?: string | null;
  tagNames?: string[];
}

export interface TransactionQuery {
  from?: string;
  to?: string;
  categoryId?: number;
  type?: TransactionType;
  search?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ImportResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}
