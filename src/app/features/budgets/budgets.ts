import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';
import { Budget } from '../../core/models/budget.model';
import { Category } from '../../core/models/category.model';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './budgets.html',
  styleUrl: './budgets.scss',
})
export class Budgets implements OnInit {
  private readonly budgetService = inject(BudgetService);
  private readonly categoryService = inject(CategoryService);

  readonly monthNames = MONTH_NAMES;
  readonly years: number[];

  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;

  readonly loading = signal(true);
  readonly budgets = signal<Budget[]>([]);
  readonly expenseCategories = signal<Category[]>([]);

  newCategoryId: number | null = null;
  newLimitAmount: number | null = null;

  constructor() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => current - i);
  }

  ngOnInit(): void {
    this.load();
  }

  onPeriodChange(): void {
    this.load();
  }

  get availableCategories(): Category[] {
    const usedIds = new Set(this.budgets().map((b) => b.categoryId));
    return this.expenseCategories().filter((c) => !usedIds.has(c.id));
  }

  addBudget(): void {
    if (!this.newCategoryId || !this.newLimitAmount) return;
    this.budgetService
      .upsert({ categoryId: this.newCategoryId, year: this.year, month: this.month, limitAmount: this.newLimitAmount })
      .subscribe(() => {
        this.newCategoryId = null;
        this.newLimitAmount = null;
        this.load();
      });
  }

  updateLimit(budget: Budget, value: string): void {
    const limitAmount = Number(value);
    if (!limitAmount || limitAmount === budget.limitAmount) return;
    this.budgetService
      .upsert({ categoryId: budget.categoryId, year: this.year, month: this.month, limitAmount })
      .subscribe(() => this.load());
  }

  deleteBudget(budget: Budget): void {
    if (!confirm(`Remove the budget for "${budget.categoryName}"?`)) return;
    this.budgetService.delete(budget.id).subscribe(() => this.load());
  }

  barColor(percentage: number): 'primary' | 'accent' | 'warn' {
    if (percentage >= 100) return 'warn';
    if (percentage >= 80) return 'accent';
    return 'primary';
  }

  private load(): void {
    this.loading.set(true);
    forkJoin({
      budgets: this.budgetService.getForMonth(this.year, this.month),
      categories: this.categoryService.getAll(),
    }).subscribe({
      next: ({ budgets, categories }) => {
        this.budgets.set(budgets);
        this.expenseCategories.set(categories.filter((c) => c.type === 'Expense'));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
