import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private Http: HttpClient) {}

  validate_email_exist(email: string) {
    return this.Http.post(
      BASE_URL + '/auth/validate_email',
      { email },
      getAuthHttpOptions()
    );
  }

  validate_username_exist(username: string) {
    return this.Http.post(
      BASE_URL + '/auth/validate_username',
      { username },
      getAuthHttpOptions()
    );
  }
}
