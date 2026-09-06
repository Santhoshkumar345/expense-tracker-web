import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SavingsGoal, SavingsGoalCreate } from '../../core/models/savings-goal.model';

export interface GoalDialogData {
  goal: SavingsGoal | null;
}

@Component({
  selector: 'app-goal-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './goal-dialog.html',
  styleUrl: './goal-dialog.scss',
})
export class GoalDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<GoalDialog, SavingsGoalCreate>>(MatDialogRef);
  readonly data = inject<GoalDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data.goal;

  readonly form = this.fb.group({
    name: [this.data.goal?.name ?? '', Validators.required],
    targetAmount: [this.data.goal?.targetAmount ?? null, [Validators.required, Validators.min(0.01)]],
    targetDate: [this.data.goal?.targetDate ? new Date(this.data.goal.targetDate) : null],
  });

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const targetDate: Date | null = raw.targetDate as unknown as Date | null;

    this.dialogRef.close({
      name: raw.name!,
      targetAmount: Number(raw.targetAmount),
      targetDate: targetDate ? targetDate.toISOString().slice(0, 10) : null,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
