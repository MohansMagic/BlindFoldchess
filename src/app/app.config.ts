import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Removed provideBrowserGlobalErrorListeners() for Angular 18 compatibility
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
