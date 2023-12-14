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
import { provideHttpClient } from '@angular/common/http';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environments } from 'environments';

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
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environments.googleClientId),
          },
          // {
          //   id: Fac,
          //   provider: new GoogleLoginProvider(
          //     '752731306131-k6biq6c3ts8da0831u9lst8js4ffhscd.apps.googleusercontent.com'
          //   ),
          // },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
};
