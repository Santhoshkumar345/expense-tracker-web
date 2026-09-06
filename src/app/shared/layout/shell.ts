import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { RecurringTransactionService } from '../../core/services/recurring-transaction.service';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly recurringService = inject(RecurringTransactionService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpointObserver.observe(MOBILE_BREAKPOINT).pipe(map((result) => result.matches)),
    { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) },
  );

  readonly sidenavOpened = signal(!this.isMobile());

  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/ledger', label: 'Ledger', icon: 'receipt_long' },
    { path: '/analysis', label: 'Analysis', icon: 'insights' },
    { path: '/budgets', label: 'Budgets', icon: 'pie_chart' },
    { path: '/recurring', label: 'Recurring', icon: 'autorenew' },
    { path: '/savings-goals', label: 'Savings Goals', icon: 'savings' },
    { path: '/categories', label: 'Categories', icon: 'category' },
  ];

  constructor() {
    this.recurringService.materialize().subscribe();

    effect(() => {
      this.sidenavOpened.set(!this.isMobile());
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((open) => !open);
  }

  onNavClicked(): void {
    if (this.isMobile()) this.sidenavOpened.set(false);
  }

  logout(): void {
    this.auth.logout();
  }
}
