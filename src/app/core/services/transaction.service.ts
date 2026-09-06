import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult, Transaction, TransactionCreate, TransactionQuery } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  constructor(private readonly http: HttpClient) {}

  getAll(query: TransactionQuery): Observable<PagedResult<Transaction>> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PagedResult<Transaction>>(this.baseUrl, { params });
  }

  create(dto: TransactionCreate): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, dto);
  }

  update(id: number, dto: TransactionCreate): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
