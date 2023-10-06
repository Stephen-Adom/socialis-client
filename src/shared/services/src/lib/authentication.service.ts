import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { AuthResponseType, UserRegistrationDetailsType } from 'utils';
import * as localforage from 'localforage';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private store: Store<AppState>,
    private Http: HttpClient,
    private router: Router
  ) {}

  validate_email_exist(email: string) {
    return this.Http.post<{
      email_exist: boolean;
      status: string;
    }>(BASE_URL + '/auth/validate_email', { email }, getAuthHttpOptions());
  }

  validate_username_exist(username: string) {
    return this.Http.post<{
      username_exist: boolean;
      status: string;
    }>(
      BASE_URL + '/auth/validate_username',
      { username },
      getAuthHttpOptions()
    );
  }

  registerUser(userDetails: UserRegistrationDetailsType) {
    return this.Http.post<AuthResponseType>(
      BASE_URL + '/auth/register',
      userDetails,
      getAuthHttpOptions()
    );
  }

  loginUser(userDetails: { username: string; password: string }) {
    return this.Http.post<AuthResponseType>(
      BASE_URL + '/auth/login',
      userDetails,
      getAuthHttpOptions()
    );
  }

  async saveAndRedirectUser(response: AuthResponseType) {
    try {
      await localforage.setItem('accessToken', response.accessToken);
      await localforage.setItem('refreshToken', response.refreshToken);
      await localforage.setItem('userInfo', response.data);
      this.store.dispatch(
        AppApiActions.storeUserAuthInfo({
          userInfo: response.data,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log(error);
    }
  }
}
