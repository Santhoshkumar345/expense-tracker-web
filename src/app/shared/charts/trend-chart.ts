import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { TrendPoint } from '../../core/models/dashboard.model';

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

  private chart?: Chart;

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
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.points.map((p) => p.periodLabel),
        datasets: [
          {
            label: 'Income',
            data: this.points.map((p) => p.income),
            backgroundColor: '#22c55e',
          },
          {
            label: 'Expense',
            data: this.points.map((p) => p.expense),
            backgroundColor: '#ef4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { position: 'top' },
        },
      },
    });
  }
}
