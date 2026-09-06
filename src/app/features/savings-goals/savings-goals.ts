import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SavingsGoalService } from '../../core/services/savings-goal.service';
import { SavingsGoal, SavingsGoalCreate } from '../../core/models/savings-goal.model';
import { GoalDialog, GoalDialogData } from './goal-dialog';

@Component({
  selector: 'app-savings-goals',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './savings-goals.html',
  styleUrl: './savings-goals.scss',
})
export class SavingsGoals implements OnInit {
  private readonly goalService = inject(SavingsGoalService);
  private readonly dialog = inject(MatDialog);

  readonly goals = signal<SavingsGoal[]>([]);
  readonly loading = signal(true);
  contributionAmount: Record<number, number | null> = {};

  ngOnInit(): void {
    this.load();
  }

  openAddDialog(): void {
    this.openDialog(null);
  }

  openEditDialog(goal: SavingsGoal): void {
    this.openDialog(goal);
  }

  contribute(goal: SavingsGoal): void {
    const amount = this.contributionAmount[goal.id];
    if (!amount) return;
    this.goalService.contribute(goal.id, amount).subscribe(() => {
      this.contributionAmount[goal.id] = null;
      this.load();
    });
  }

  deleteGoal(goal: SavingsGoal): void {
    if (!confirm(`Delete the goal "${goal.name}"?`)) return;
    this.goalService.delete(goal.id).subscribe(() => this.load());
  }

  private openDialog(goal: SavingsGoal | null): void {
    const ref = this.dialog.open<GoalDialog, GoalDialogData, SavingsGoalCreate>(GoalDialog, {
      width: '380px',
      maxWidth: '95vw',
      data: { goal },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const request = goal ? this.goalService.update(goal.id, result) : this.goalService.create(result);
      request.subscribe(() => this.load());
    });
  }

  private load(): void {
    this.loading.set(true);
    this.goalService.getAll().subscribe({
      next: (goals) => {
        this.goals.set(goals);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
