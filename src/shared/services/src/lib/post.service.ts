/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { AllPostResponseType, SuccessMessageType } from 'utils';

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
    return this.http.post<SuccessMessageType>(
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

  fetchPostById(postId: number) {
    return this.http.get<AllPostResponseType>(
      BASE_URL + '/' + postId + '/post',
      this.authHeaders
    );
  }

  togglePostLike(postId: number, userId: number) {
    console.log(postId, userId);
    return this.http.get(
      BASE_URL + `/${userId}/${postId}/like`,
      this.authHeaders
    );
  }
}
