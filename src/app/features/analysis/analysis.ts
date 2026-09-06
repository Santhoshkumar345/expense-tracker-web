import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../core/services/dashboard.service';
import { TrendGranularity, TrendPoint } from '../../core/models/dashboard.model';
import { TrendChart } from '../../shared/charts/trend-chart';

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    TrendChart,
  ],
  templateUrl: './analysis.html',
  styleUrl: './analysis.scss',
})
export class Analysis implements OnInit {
  granularity: TrendGranularity = 'Daily';
  from = toIso(this.defaultFrom());
  to = toIso(new Date());

  readonly loading = signal(true);
  readonly points = signal<TrendPoint[]>([]);
  readonly displayedColumns = ['periodLabel', 'income', 'expense', 'net'];

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.load();
  }

  onGranularityChange(): void {
    if (this.granularity === 'Daily') this.from = toIso(this.addDays(new Date(), -30));
    if (this.granularity === 'Weekly') this.from = toIso(this.addDays(new Date(), -84));
    if (this.granularity === 'Monthly') this.from = toIso(this.addDays(new Date(), -365));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.dashboardService.getTrend(this.granularity, this.from, this.to).subscribe({
      next: (points) => {
        this.points.set(points);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get totals() {
    const points = this.points();
    return {
      income: points.reduce((sum, p) => sum + p.income, 0),
      expense: points.reduce((sum, p) => sum + p.expense, 0),
      net: points.reduce((sum, p) => sum + p.net, 0),
    };
  }

  private defaultFrom(): Date {
    return this.addDays(new Date(), -30);
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
}
