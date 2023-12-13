import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { StoreModule, provideStore } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppReducer, featureAppKey } from 'state';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LogLevel, provideAuth } from 'angular-auth-oidc-client';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(StoreModule.forRoot(), EffectsModule.forRoot()),

    provideStore({
      [featureAppKey]: AppReducer,
    }),
    provideEffects(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideAnimations(),
    provideHttpClient(),
    provideAuth({
      config: {
        authority: 'https://accounts.google.com',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId:
          '752731306131-k6biq6c3ts8da0831u9lst8js4ffhscd.apps.googleusercontent.com',
        scope: 'openid profile email',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      },
    }),
  ],
};
