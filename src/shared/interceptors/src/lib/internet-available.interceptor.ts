/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  catchError,
  last,
  mergeMap,
  of,
  shareReplay,
  throwError,
} from 'rxjs';
import { isConnected } from 'utils';

@Injectable()
export class InternetAvailableInterceptor implements HttpInterceptor {
  connectivity$: Observable<boolean>;

  constructor() {
    // Share the connectivity status among requests
    this.connectivity$ = of(isConnected()).pipe(shareReplay(1));
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.connectivity$.pipe(
      mergeMap((connected) => {
        if (connected) {
          return next.handle(request);
        }

        return throwError(() => new Error('No internet connection')).pipe(
          last(),
          catchError((error) => {
            if (error) {
              this.handleError(error);
            }

            return throwError(null);
          })
        );
      })
    );
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
  }
}
