/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookmarkResponseType } from 'utils';
import BASE_URL from './base_url';
import { getAuthHttpOptions } from './httpHeaders';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  authHeaders: any;

  constructor(private http: HttpClient) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  fetchAllBookmarks(userId: number) {
    return this.http.get<BookmarkResponseType>(
      BASE_URL + '/bookmarks/' + userId + '/all',
      this.authHeaders
    );
  }
}
