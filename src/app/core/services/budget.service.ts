import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget, BudgetUpsert } from '../models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly baseUrl = `${environment.apiUrl}/budgets`;

  constructor(private readonly http: HttpClient) {}

  getForMonth(year: number, month: number): Observable<Budget[]> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<Budget[]>(this.baseUrl, { params });
  }

  upsert(dto: BudgetUpsert): Observable<Budget> {
    return this.http.put<Budget>(this.baseUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
