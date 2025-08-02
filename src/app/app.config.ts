import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SHARED_IMPORTS } from './shared-imports'; // 👈 nuevo

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    SHARED_IMPORTS // 👈 incluimos aquí los imports comunes
  ]
};
