/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { UserInfoType } from 'utils';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import * as localforage from 'localforage';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ValidateAuthUserService {
  helper = new JwtHelperService();

  constructor(private store: Store<AppState>, private router: Router) {}

  validateAuthUser(
    accessToken: string | null,
    refreshToken: string | null,
    userInfo: UserInfoType | null
  ) {
    if (accessToken && refreshToken) {
      const isExpired = this.helper.isTokenExpired(accessToken);

      if (isExpired) {
        localforage.removeItem('accessToken');
        localforage.removeItem('refreshToken');
        localforage.removeItem('userInfo');
        this.routeToLogin();
        return;
      }
    }
    if (userInfo && !userInfo.enabled) {
      //   this.routeToLogin();
      return;
    }

    if (accessToken && refreshToken && userInfo) {
      this.store.dispatch(
        AppApiActions.storeUserAuthInfo({
          userInfo,
          accessToken,
          refreshToken,
        })
      );
    }
  }

  routeToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
