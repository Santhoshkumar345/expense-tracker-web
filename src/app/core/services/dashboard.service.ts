import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CategoryBreakdownItem,
  MonthSummary,
  TrendGranularity,
  TrendPoint,
} from '../models/dashboard.model';
import { TransactionType } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly dashboardUrl = `${environment.apiUrl}/dashboard`;
  private readonly analysisUrl = `${environment.apiUrl}/analysis`;

  constructor(private readonly http: HttpClient) {}

  getMonthSummary(year: number, month: number): Observable<MonthSummary> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<MonthSummary>(`${this.dashboardUrl}/summary`, { params });
  }

  getCategoryBreakdown(
    year: number,
    month: number,
    type: TransactionType = 'Expense',
  ): Observable<CategoryBreakdownItem[]> {
    const params = new HttpParams().set('year', year).set('month', month).set('type', type);
    return this.http.get<CategoryBreakdownItem[]>(`${this.dashboardUrl}/category-breakdown`, { params });
  }

  getTrend(granularity: TrendGranularity, from: string, to: string): Observable<TrendPoint[]> {
    const params = new HttpParams().set('granularity', granularity).set('from', from).set('to', to);
    return this.http.get<TrendPoint[]>(`${this.analysisUrl}/trend`, { params });
  }
}
