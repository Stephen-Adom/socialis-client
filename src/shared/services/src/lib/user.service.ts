/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHttpOptions } from './httpHeaders';
import { SuccessMessageType } from 'utils';
import BASE_URL from './base_url';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authHeaders: any;

  constructor(private http: HttpClient) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  updateUserCoverImage(formData: FormData) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + '/user/update_cover_background',
      formData,
      this.authHeaders
    );
  }

  updateUserProfileImage(formData: FormData) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + '/user/update_profile_image',
      formData,
      this.authHeaders
    );
  }
}
