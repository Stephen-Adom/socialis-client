/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BASE_URL from './base_url';
import { getNonAuthHttpOptions } from './httpHeaders';
import { AuthResponseType, UserRegistrationDetailsType } from 'utils';
import * as localforage from 'localforage';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { InnactiveAccountService } from './innactiveAccount.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  helper = new JwtHelperService();

  constructor(
    private innactiveAccountService: InnactiveAccountService,
    private store: Store<AppState>,
    private Http: HttpClient,
    private router: Router
  ) {}

  validate_email_exist(email: string) {
    return this.Http.post<{
      email_exist: boolean;
      status: string;
    }>(BASE_URL + '/auth/validate_email', { email }, getNonAuthHttpOptions());
  }

  validate_username_exist(username: string) {
    return this.Http.post<{
      username_exist: boolean;
      status: string;
    }>(
      BASE_URL + '/auth/validate_username',
      { username },
      getNonAuthHttpOptions()
    );
  }

  registerUser(userDetails: UserRegistrationDetailsType) {
    return this.Http.post<AuthResponseType>(
      BASE_URL + '/auth/register',
      userDetails,
      getNonAuthHttpOptions()
    );
  }

  loginUser(userDetails: { username: string; password: string }) {
    return this.Http.post<AuthResponseType>(
      BASE_URL + '/auth/login',
      userDetails,
      getNonAuthHttpOptions()
    );
  }

  verifyEmailToken(token: string) {
    return this.Http.post<{
      token_valid: boolean;
      status: string;
    }>(
      BASE_URL + '/auth/verify_email_token',
      { token },
      getNonAuthHttpOptions()
    );
  }

  sendEmailVerificationToken(token: string) {
    return this.Http.get<{
      message: string;
      status: string;
    }>(BASE_URL + '/auth/resend_verification_token?token=' + token);
  }

  sendEmailLink(email: string) {
    return this.Http.get<{
      message: string;
      status: string;
    }>(BASE_URL + '/auth/resend_verification_link?email=' + email);
  }

  resetPassword(email: string) {
    return this.Http.post<{
      message: string;
      status: string;
    }>(BASE_URL + '/auth/reset_password', { email }, getNonAuthHttpOptions());
  }

  changePassword(newpassword: { password: string }, token: string) {
    return this.Http.post<{
      message: string;
      status: string;
    }>(
      BASE_URL + '/auth/change_password?token=' + token,
      { password: newpassword.password },
      getNonAuthHttpOptions()
    );
  }

  async tokenExist(): Promise<string | null> {
    return await localforage.getItem('accessToken');
  }

  tokenIsExpired(accessToken: string) {
    return this.helper.isTokenExpired(accessToken);
  }

  async saveAndRedirectUser(response: AuthResponseType) {
    if (response.data.enabled) {
      try {
        await localforage.removeItem('userEmail');
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
        window.location.href = '/feeds';
      } catch (error) {
        console.log(error);
      }
    } else {
      localforage.setItem('userEmail', response.data.email);
      this.innactiveAccountService.accountIsNotActive(true);
    }
  }
}
