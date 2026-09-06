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
import { RecurringTransaction, RecurringTransactionCreate } from '../../core/models/recurring-transaction.model';

export interface RecurringDialogData {
  categories: Category[];
  recurring: RecurringTransaction | null;
}

@Component({
  selector: 'app-recurring-dialog',
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
  templateUrl: './recurring-dialog.html',
  styleUrl: './recurring-dialog.scss',
})
export class RecurringDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<RecurringDialog, RecurringTransactionCreate>>(MatDialogRef);
  readonly data = inject<RecurringDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data.recurring;

  readonly form = this.fb.group({
    type: [this.data.recurring?.type ?? ('Expense' as 'Income' | 'Expense'), Validators.required],
    amount: [this.data.recurring?.amount ?? null, [Validators.required, Validators.min(0.01)]],
    categoryId: [this.data.recurring?.categoryId ?? null, Validators.required],
    subCategoryId: [this.data.recurring?.subCategoryId ?? null],
    frequency: [this.data.recurring?.frequency ?? ('Monthly' as 'Weekly' | 'Monthly'), Validators.required],
    startDate: [this.data.recurring ? new Date(this.data.recurring.startDate) : new Date(), Validators.required],
    endDate: [this.data.recurring?.endDate ? new Date(this.data.recurring.endDate) : null],
    note: [this.data.recurring?.note ?? ''],
    paymentMethod: [this.data.recurring?.paymentMethod ?? ''],
  });

  readonly selectedType = signal<'Income' | 'Expense'>(this.data.recurring?.type ?? 'Expense');

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
    const startDate: Date = raw.startDate as unknown as Date;
    const endDate: Date | null = raw.endDate as unknown as Date | null;

    this.dialogRef.close({
      type: raw.type as 'Income' | 'Expense',
      amount: Number(raw.amount),
      categoryId: Number(raw.categoryId),
      subCategoryId: raw.subCategoryId ? Number(raw.subCategoryId) : null,
      frequency: raw.frequency as 'Weekly' | 'Monthly',
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate ? endDate.toISOString().slice(0, 10) : null,
      note: raw.note || null,
      paymentMethod: raw.paymentMethod || null,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
