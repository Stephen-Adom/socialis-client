import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppReducer, featureAppKey } from 'state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ [featureAppKey]: AppReducer }),
    provideEffects(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideStoreDevtools({ logOnly: !isDevMode() }),
  ],
};
