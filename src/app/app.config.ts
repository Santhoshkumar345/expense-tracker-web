import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|ChunkLoadError|Loading chunk .* failed/i.test(message);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withNavigationErrorHandler((event) => {
        if (isStaleChunkError(event.error)) {
          window.location.href = event.url;
        }
      }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
