/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { SuccessMessageType } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  authHeaders: any;

  constructor(private http: HttpClient) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  createComment(formData: FormData) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + '/comment',
      formData,
      this.authHeaders
    );
  }

  // fetchAllPost() {
  //   return this.http.get<AllPostResponseType>(
  //     BASE_URL + '/all_posts',
  //     this.authHeaders
  //   );
  // }
}
