/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AllStoriesResponseType,
  AllWatchedStoriesResponseType,
  SuccessMessageType,
  WatchedStoryResponseType,
  StoriesResponseType,
} from 'utils';
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

  uploadMultipleStory(formData: FormData, userId: number) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + `/stories/${userId}/upload/multiple`,
      formData,
      this.authHeaders
    );
  }

  fetchUserStoryById(userId: number) {
    return this.http.get<StoriesResponseType>(
      BASE_URL + `/stories/${userId}/all`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  userWatchedStory(userId: number, mediaId: number) {
    return this.http.get<WatchedStoryResponseType>(
      BASE_URL + `/stories/${userId}/watched/${mediaId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  fetchAllWatchedUserStories(mediaId: number) {
    return this.http.get<AllWatchedStoriesResponseType>(
      BASE_URL + `/stories/${mediaId}/watched/users`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  fetchAllStoriesForUserFollowings(userId: number) {
    return this.http.get<AllStoriesResponseType>(
      BASE_URL + `/stories/${userId}/following/stories`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
