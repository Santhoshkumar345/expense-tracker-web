import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RecurringTransaction,
  RecurringTransactionCreate,
  RecurringTransactionUpdate,
} from '../models/recurring-transaction.model';

@Injectable({ providedIn: 'root' })
export class RecurringTransactionService {
  private readonly baseUrl = `${environment.apiUrl}/recurring-transactions`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RecurringTransaction[]> {
    return this.http.get<RecurringTransaction[]>(this.baseUrl);
  }

  create(dto: RecurringTransactionCreate): Observable<RecurringTransaction> {
    return this.http.post<RecurringTransaction>(this.baseUrl, dto);
  }

  update(id: number, dto: RecurringTransactionUpdate): Observable<RecurringTransaction> {
    return this.http.put<RecurringTransaction>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  materialize(): Observable<{ created: number }> {
    return this.http.post<{ created: number }>(`${this.baseUrl}/materialize`, {});
  }
}
