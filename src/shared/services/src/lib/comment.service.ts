/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';
import { AllCommentResponseType, SuccessMessageType } from 'utils';

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

  editComment(commentId: number, formData: FormData) {
    return this.http.put<SuccessMessageType>(
      BASE_URL + '/comment/' + commentId + '/edit',
      formData,
      this.authHeaders
    );
  }

  deleteComment(commentId: number) {
    return this.http.delete<SuccessMessageType>(
      BASE_URL + '/comment/' + commentId + '/delete',
      this.authHeaders
    );
  }

  fetchAllPost(postId: number) {
    return this.http.get<AllCommentResponseType>(
      BASE_URL + `/${postId}/comments`,
      this.authHeaders
    );
  }
}
