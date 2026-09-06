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
import { ThemeService } from '../../core/theme/theme.service';
import { readChartPalette } from './chart-theme';

export interface DonutChartSlice {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        height: 280px;
      }
    `,
  ],
})
export class DonutChart implements AfterViewInit, OnChanges, OnDestroy {
  @Input() slices: DonutChartSlice[] = [];
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
    if (changes['slices'] && this.canvasRef) {
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
      type: 'doughnut',
      data: {
        labels: this.slices.map((s) => s.label),
        datasets: [
          {
            data: this.slices.map((s) => s.value),
            backgroundColor: this.slices.map((s) => s.color),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: palette.onSurface } },
        },
      },
    });
  }
}
