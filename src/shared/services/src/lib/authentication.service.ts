import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { AuthResponseType, UserRegistrationDetailsType } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private Http: HttpClient) {}

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
}
