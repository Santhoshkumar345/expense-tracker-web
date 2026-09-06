import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../core/services/dashboard.service';
import { MonthSummary, CategoryBreakdownItem, TrendPoint } from '../../core/models/dashboard.model';
import { DonutChart, DonutChartSlice } from '../../shared/charts/donut-chart';
import { TrendChart } from '../../shared/charts/trend-chart';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DonutChart,
    TrendChart,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly monthNames = MONTH_NAMES;
  readonly years: number[];

  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;

  readonly loading = signal(true);
  readonly summary = signal<MonthSummary | null>(null);
  readonly breakdown = signal<CategoryBreakdownItem[]>([]);
  readonly trend = signal<TrendPoint[]>([]);

  constructor(private readonly dashboardService: DashboardService) {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => current - i);
  }

  ngOnInit(): void {
    this.load();
  }

  onPeriodChange(): void {
    this.load();
  }

  get donutSlices(): DonutChartSlice[] {
    return this.breakdown().map((b) => ({ label: b.categoryName, value: b.amount, color: b.color }));
  }

  private load(): void {
    this.loading.set(true);

    const trendFrom = this.monthsAgoIso(5);
    const trendTo = this.endOfMonthIso(this.year, this.month);

    forkJoin({
      summary: this.dashboardService.getMonthSummary(this.year, this.month),
      breakdown: this.dashboardService.getCategoryBreakdown(this.year, this.month, 'Expense'),
      trend: this.dashboardService.getTrend('Monthly', trendFrom, trendTo),
    }).subscribe({
      next: ({ summary, breakdown, trend }) => {
        this.summary.set(summary);
        this.breakdown.set(breakdown);
        this.trend.set(trend);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private monthsAgoIso(count: number): string {
    const d = new Date(this.year, this.month - 1 - count, 1);
    return this.toIso(d);
  }

  private endOfMonthIso(year: number, month: number): string {
    const d = new Date(year, month, 0);
    return this.toIso(d);
  }

  private toIso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
