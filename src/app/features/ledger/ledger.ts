import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { TagService } from '../../core/services/tag.service';
import { Category } from '../../core/models/category.model';
import { Transaction, TransactionCreate, TransactionQuery } from '../../core/models/transaction.model';
import { Tag } from '../../core/models/tag.model';
import { TransactionDialog, TransactionDialogData } from './transaction-dialog';

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './ledger.html',
  styleUrl: './ledger.scss',
})
export class Ledger implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly transactionService = inject(TransactionService);
  private readonly tagService = inject(TagService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild('importInput') importInput!: ElementRef<HTMLInputElement>;

  readonly displayedColumns = ['date', 'category', 'note', 'tags', 'amount', 'actions'];
  readonly categories = signal<Category[]>([]);
  readonly tags = signal<Tag[]>([]);
  readonly transactions = signal<Transaction[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(true);
  readonly importing = signal(false);

  page = 0;
  pageSize = 20;

  filters: { from: string; to: string; categoryId: number | null; type: 'Income' | 'Expense' | null; search: string; tag: string | null } = {
    from: '',
    to: '',
    categoryId: null,
    type: null,
    search: '',
    tag: null,
  };

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((categories) => this.categories.set(categories));
    this.tagService.getAll().subscribe((tags) => this.tags.set(tags));
    this.load();
  }

  applyFilters(): void {
    this.page = 0;
    this.load();
  }

  clearFilters(): void {
    this.filters = { from: '', to: '', categoryId: null, type: null, search: '', tag: null };
    this.applyFilters();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  openAddDialog(): void {
    this.openDialog(null);
  }

  openEditDialog(transaction: Transaction): void {
    this.openDialog(transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    if (!confirm(`Delete this transaction: "${transaction.note || transaction.categoryName}"?`)) return;
    this.transactionService.delete(transaction.id).subscribe(() => this.load());
  }

  exportCsv(): void {
    this.transactionService.exportCsv(this.filters.from || undefined, this.filters.to || undefined).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  triggerImport(): void {
    this.importInput.nativeElement.click();
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.importing.set(true);
    this.transactionService.importCsv(file).subscribe({
      next: (result) => {
        this.importing.set(false);
        input.value = '';
        const message = `Imported ${result.importedCount} transaction(s)` + (result.skippedCount ? `, skipped ${result.skippedCount}` : '');
        this.snackBar.open(message, 'Dismiss', { duration: 5000 });
        this.categoryService.getAll().subscribe((categories) => this.categories.set(categories));
        this.tagService.getAll().subscribe((tags) => this.tags.set(tags));
        this.load();
      },
      error: () => {
        this.importing.set(false);
        input.value = '';
        this.snackBar.open('Import failed. Check the file format and try again.', 'Dismiss', { duration: 5000 });
      },
    });
  }

  private openDialog(transaction: Transaction | null): void {
    const ref = this.dialog.open<TransactionDialog, TransactionDialogData, TransactionCreate>(TransactionDialog, {
      width: '420px',
      maxWidth: '95vw',
      data: { categories: this.categories(), transaction },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const request = transaction
        ? this.transactionService.update(transaction.id, result)
        : this.transactionService.create(result);
      request.subscribe(() => {
        this.tagService.getAll().subscribe((tags) => this.tags.set(tags));
        this.load();
      });
    });
  }

  private load(): void {
    this.loading.set(true);
    const query: TransactionQuery = {
      from: this.filters.from || undefined,
      to: this.filters.to || undefined,
      categoryId: this.filters.categoryId ?? undefined,
      type: this.filters.type ?? undefined,
      search: this.filters.search || undefined,
      tag: this.filters.tag ?? undefined,
      page: this.page + 1,
      pageSize: this.pageSize,
    };

    this.transactionService.getAll(query).subscribe({
      next: (result) => {
        this.transactions.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
