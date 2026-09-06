export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  targetDate: string | null;
  savedAmount: number;
  percentageComplete: number;
}

export interface SavingsGoalCreate {
  name: string;
  targetAmount: number;
  targetDate?: string | null;
}
