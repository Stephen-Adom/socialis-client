/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { AllPostResponseType, NewPostResponseType } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  authHeaders: any;
  constructor(private http: HttpClient) {
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

  fetchAllPost(userId: number) {
    return this.http.get<AllPostResponseType>(
      BASE_URL + '/' + userId + '/posts',
      this.authHeaders
    );
  }
}
