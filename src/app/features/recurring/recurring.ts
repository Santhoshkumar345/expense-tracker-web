import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { RecurringTransactionService } from '../../core/services/recurring-transaction.service';
import { Category } from '../../core/models/category.model';
import { RecurringTransaction, RecurringTransactionCreate } from '../../core/models/recurring-transaction.model';
import { RecurringDialog, RecurringDialogData } from './recurring-dialog';

@Component({
  selector: 'app-recurring',
  standalone: true,
  imports: [
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './recurring.html',
  styleUrl: './recurring.scss',
})
export class Recurring implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly recurringService = inject(RecurringTransactionService);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns = ['category', 'amount', 'frequency', 'next', 'active', 'actions'];
  readonly categories = signal<Category[]>([]);
  readonly items = signal<RecurringTransaction[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  openAddDialog(): void {
    this.openDialog(null);
  }

  openEditDialog(item: RecurringTransaction): void {
    this.openDialog(item);
  }

  toggleActive(item: RecurringTransaction): void {
    this.recurringService
      .update(item.id, {
        type: item.type,
        amount: item.amount,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        note: item.note,
        paymentMethod: item.paymentMethod,
        frequency: item.frequency,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: !item.isActive,
      })
      .subscribe(() => this.load());
  }

  deleteItem(item: RecurringTransaction): void {
    if (!confirm(`Delete this recurring ${item.type.toLowerCase()}?`)) return;
    this.recurringService.delete(item.id).subscribe(() => this.load());
  }

  private openDialog(item: RecurringTransaction | null): void {
    const ref = this.dialog.open<RecurringDialog, RecurringDialogData, RecurringTransactionCreate>(RecurringDialog, {
      width: '440px',
      data: { categories: this.categories(), recurring: item },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const request = item
        ? this.recurringService.update(item.id, { ...result, isActive: true })
        : this.recurringService.create(result);
      request.subscribe(() => this.load());
    });
  }

  private load(): void {
    this.loading.set(true);
    forkJoin({
      categories: this.categoryService.getAll(),
      items: this.recurringService.getAll(),
    }).subscribe({
      next: ({ categories, items }) => {
        this.categories.set(categories);
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
