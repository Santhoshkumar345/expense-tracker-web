import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Category } from '../../core/models/category.model';
import { Transaction, TransactionCreate } from '../../core/models/transaction.model';

export interface TransactionDialogData {
  categories: Category[];
  transaction: Transaction | null;
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './transaction-dialog.html',
  styleUrl: './transaction-dialog.scss',
})
export class TransactionDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<TransactionDialog, TransactionCreate>>(MatDialogRef);
  readonly data = inject<TransactionDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data.transaction;

  readonly form = this.fb.group({
    type: [this.data.transaction?.type ?? ('Expense' as 'Income' | 'Expense'), Validators.required],
    date: [this.data.transaction ? new Date(this.data.transaction.date) : new Date(), Validators.required],
    amount: [this.data.transaction?.amount ?? null, [Validators.required, Validators.min(0.01)]],
    categoryId: [this.data.transaction?.categoryId ?? null, Validators.required],
    subCategoryId: [this.data.transaction?.subCategoryId ?? null],
    note: [this.data.transaction?.note ?? ''],
    paymentMethod: [this.data.transaction?.paymentMethod ?? ''],
  });

  readonly selectedType = signal<'Income' | 'Expense'>(this.data.transaction?.type ?? 'Expense');

  constructor() {
    this.form.controls.type.valueChanges.subscribe((value) => {
      if (value) {
        this.selectedType.set(value);
        this.form.controls.categoryId.setValue(null);
        this.form.controls.subCategoryId.setValue(null);
      }
    });
  }

  get filteredCategories(): Category[] {
    return this.data.categories.filter((c) => c.type === this.selectedType());
  }

  get subCategories() {
    const categoryId = this.form.controls.categoryId.value;
    return this.filteredCategories.find((c) => c.id === categoryId)?.subCategories ?? [];
  }

  submit(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const date: Date = raw.date as unknown as Date;

    const result: TransactionCreate = {
      type: raw.type as 'Income' | 'Expense',
      date: date.toISOString().slice(0, 10),
      amount: Number(raw.amount),
      categoryId: Number(raw.categoryId),
      subCategoryId: raw.subCategoryId ? Number(raw.subCategoryId) : null,
      note: raw.note || null,
      paymentMethod: raw.paymentMethod || null,
    };

    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
