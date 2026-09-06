import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Category, CategoryCreate, TransactionType } from '../../core/models/category.model';

export interface CategoryDialogData {
  category: Category | null;
  defaultType: TransactionType;
}

const PALETTE = ['#6366f1', '#22c55e', '#ef4444', '#f97316', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#eab308', '#64748b'];

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonToggleModule, MatButtonModule],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.scss',
})
export class CategoryDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<CategoryDialog, CategoryCreate>>(MatDialogRef);
  readonly data = inject<CategoryDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data.category;
  readonly palette = PALETTE;

  readonly form = this.fb.group({
    name: [this.data.category?.name ?? '', Validators.required],
    type: [this.data.category?.type ?? this.data.defaultType, Validators.required],
    color: [this.data.category?.color ?? PALETTE[0], Validators.required],
  });

  selectColor(color: string): void {
    this.form.controls.color.setValue(color);
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.dialogRef.close({
      name: raw.name!,
      type: raw.type as TransactionType,
      color: raw.color!,
      icon: this.data.category?.icon ?? 'category',
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
