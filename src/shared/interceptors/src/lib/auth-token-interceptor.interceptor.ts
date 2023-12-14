import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from, mergeMap } from 'rxjs';
import * as localforage from 'localforage';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthTokenInterceptorInterceptor implements HttpInterceptor {
  helper = new JwtHelperService();
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(localforage.getItem('accessToken')).pipe(
      mergeMap((token: unknown) => {
        const isExpired = this.helper.isTokenExpired(token as string);
        if (!isExpired) {
          const requestClone = request.clone({
            setHeaders: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          });
          return next.handle(requestClone) as Observable<HttpEvent<unknown>>;
        }
        return next.handle(request) as Observable<HttpEvent<unknown>>;
      })
    );
  }
}
