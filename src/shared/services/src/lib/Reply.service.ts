/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHttpOptions } from './httpHeaders';
import { AllRepliesResponseType, SuccessMessageType } from 'utils';
import BASE_URL from './base_url';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  authHeaders: any;

  constructor(private http: HttpClient) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  fetchAllReplies(commentId: number) {
    return this.http.get<AllRepliesResponseType>(
      BASE_URL + '/' + commentId + '/all_replies'
    );
  }

  createReply(formData: FormData) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + '/reply',
      formData,
      this.authHeaders
    );
  }
}
