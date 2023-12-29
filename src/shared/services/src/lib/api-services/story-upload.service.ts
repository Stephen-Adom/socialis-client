/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuccessMessageType } from 'utils';
import BASE_URL from '../base_url';

@Injectable({
  providedIn: 'root',
})
export class StoryUploadService {
  authHeaders = {
    headers: new HttpHeaders({}),
  };

  constructor(private http: HttpClient) {}

  uploadStory(formData: FormData, userId: number) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + `/stories/${userId}/upload`,
      formData,
      this.authHeaders
    );
  }
}
