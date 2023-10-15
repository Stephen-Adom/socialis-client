/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { AllPostResponseType, NewPostResponseType } from 'utils';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  authHeaders: any;
  constructor(
    private messageservice: MessageService,
    private http: HttpClient
  ) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  createPost(formData: FormData) {
    return this.http.post<NewPostResponseType>(
      BASE_URL + '/post',
      formData,
      this.authHeaders
    );
  }

  fetchAllPost() {
    return this.http.get<AllPostResponseType>(
      BASE_URL + '/all_posts',
      this.authHeaders
    );
  }
}
