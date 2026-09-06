import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SavingsGoal, SavingsGoalCreate } from '../models/savings-goal.model';

@Injectable({ providedIn: 'root' })
export class SavingsGoalService {
  private readonly baseUrl = `${environment.apiUrl}/savings-goals`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<SavingsGoal[]> {
    return this.http.get<SavingsGoal[]>(this.baseUrl);
  }

  create(dto: SavingsGoalCreate): Observable<SavingsGoal> {
    return this.http.post<SavingsGoal>(this.baseUrl, dto);
  }

  update(id: number, dto: SavingsGoalCreate): Observable<SavingsGoal> {
    return this.http.put<SavingsGoal>(`${this.baseUrl}/${id}`, dto);
  }

  contribute(id: number, amount: number): Observable<SavingsGoal> {
    return this.http.post<SavingsGoal>(`${this.baseUrl}/${id}/contribute`, { amount });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
