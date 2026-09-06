export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export interface ChartPalette {
  income: string;
  expense: string;
  onSurface: string;
  outlineVariant: string;
}

export function readChartPalette(): ChartPalette {
  return {
    income: cssVar('--app-income'),
    expense: cssVar('--app-expense'),
    onSurface: cssVar('--mat-sys-on-surface'),
    outlineVariant: cssVar('--mat-sys-outline-variant'),
  };
}
