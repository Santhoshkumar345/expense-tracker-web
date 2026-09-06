import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImportResult, PagedResult, Transaction, TransactionCreate, TransactionQuery } from '../models/transaction.model';

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

  exportCsv(from?: string, to?: string): Observable<Blob> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get(`${this.baseUrl}/export`, { params, responseType: 'blob' });
  }

  importCsv(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResult>(`${this.baseUrl}/import`, formData);
  }
}
