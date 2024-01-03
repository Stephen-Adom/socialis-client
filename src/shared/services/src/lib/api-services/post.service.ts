/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BASE_URL, { MaxRetries } from '../base_url';
import { getAuthHttpOptions } from '../httpHeaders';
import { AllPostResponseType, SuccessMessageType } from 'utils';
import { retry } from 'rxjs';

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
    return this.http
      .post<SuccessMessageType>(BASE_URL + '/post', formData, this.authHeaders)
      .pipe(retry(MaxRetries));
  }

  editPost(postId: number, formData: FormData) {
    return this.http
      .patch<SuccessMessageType>(
        BASE_URL + '/post/' + postId + '/edit',
        formData,
        this.authHeaders
      )
      .pipe(retry(MaxRetries));
  }

  deletePost(postId: number) {
    return this.http.delete<SuccessMessageType>(
      BASE_URL + '/post/' + postId + '/delete',
      this.authHeaders
    );
  }

  fetchAllPost() {
    return this.http.get<AllPostResponseType>(
      BASE_URL + '/all_posts',
      this.authHeaders
    );
  }

  fetchAllPostWithOffset(offset: number) {
    return this.http
      .get<AllPostResponseType>(
        BASE_URL + '/all_posts_offset?offset=' + offset,
        this.authHeaders
      )
      .pipe(retry(MaxRetries));
  }

  fetchPostById(postId: string) {
    return this.http.get<AllPostResponseType>(
      BASE_URL + '/' + postId + '/post',
      this.authHeaders
    );
  }

  togglePostLike(postId: number, userId: number) {
    return this.http.get(
      BASE_URL + `/${userId}/${postId}/like`,
      this.authHeaders
    );
  }

  toggleCommentLike(commentId: number, userId: number) {
    return this.http.get(
      BASE_URL + `/${userId}/${commentId}/comment_like`,
      this.authHeaders
    );
  }

  toggleReplyLike(replyId: number, userId: number) {
    return this.http.get(
      BASE_URL + `/${userId}/${replyId}/reply_like`,
      this.authHeaders
    );
  }

  fetchAllPostsByUser(userId: number) {
    return this.http.get<AllPostResponseType>(
      BASE_URL + `/user/${userId}/posts`,
      this.authHeaders
    );
  }

  fetchAllLikesByUser(userId: number) {
    return this.http.get<AllPostResponseType>(
      BASE_URL + `/user/${userId}/likes`,
      this.authHeaders
    );
  }

  uploadStories(formData: FormData) {
    return this.http.post<SuccessMessageType>(BASE_URL + '/stories', formData);
  }
}
