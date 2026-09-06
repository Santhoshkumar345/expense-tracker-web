import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { TrendPoint } from '../../core/models/dashboard.model';
import { ThemeService } from '../../core/theme/theme.service';
import { readChartPalette } from './chart-theme';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        height: 320px;
      }
    `,
  ],
})
export class TrendChart implements AfterViewInit, OnChanges, OnDestroy {
  @Input() points: TrendPoint[] = [];
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly theme = inject(ThemeService);
  private chart?: Chart;

  constructor() {
    effect(() => {
      this.theme.isDark();
      if (this.canvasRef) this.render();
    });
  }

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.canvasRef) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(): void {
    const palette = readChartPalette();
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.points.map((p) => p.periodLabel),
        datasets: [
          {
            label: 'Income',
            data: this.points.map((p) => p.income),
            backgroundColor: palette.income,
            borderRadius: 4,
          },
          {
            label: 'Expense',
            data: this.points.map((p) => p.expense),
            backgroundColor: palette.expense,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: palette.onSurface }, grid: { color: palette.outlineVariant } },
          y: { beginAtZero: true, ticks: { color: palette.onSurface }, grid: { color: palette.outlineVariant } },
        },
        plugins: {
          legend: { position: 'top', labels: { color: palette.onSurface } },
        },
      },
    });
  }
}
