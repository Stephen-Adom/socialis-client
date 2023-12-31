/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHttpOptions } from '../httpHeaders';
import {
  AllUserSummaryInfoResponseType,
  SuccessMessageType,
  UserSummaryInfoResponseType,
  UserSummaryResponseType,
} from 'utils';
import BASE_URL, { MaxRetries } from '../base_url';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authHeaders: any;

  constructor(private http: HttpClient) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  updateUserCoverImage(formData: FormData) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + '/user/update_cover_background',
      formData,
      this.authHeaders
    );
  }

  updateUserProfileImage(formData: FormData) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + '/user/update_profile_image',
      formData,
      this.authHeaders
    );
  }

  updateUserInfo(
    userInfo: {
      firstname: string;
      lastname: string;
      username: string;
      bio: string;
      phonenumber: string;
      address: string;
    },
    userId: number
  ) {
    return this.http.post<SuccessMessageType>(
      BASE_URL + `/user/${userId}/update_user_info`,
      userInfo,
      this.authHeaders
    );
  }

  // fetchUserSummaryInfo(username: string) {
  //   return this.http.get<UserSummaryResponseType>(
  //     BASE_URL + `/user/${username}/info`,
  //     this.authHeaders
  //   );
  // }

  fetchUserFullInformation(username: string) {
    return this.http.get<UserSummaryResponseType>(
      BASE_URL + `/user/${username}/full_information`,
      this.authHeaders
    );
  }

  followUser(followId: number, followingId: number) {
    return this.http
      .get<UserSummaryInfoResponseType>(
        BASE_URL + `/user/${followId}/follow/${followingId}`,
        this.authHeaders
      )
      .pipe(retry(MaxRetries));
  }

  unfollowUser(followId: number, followingId: number) {
    return this.http
      .get<UserSummaryInfoResponseType>(
        BASE_URL + `/user/${followId}/unfollow/${followingId}`,
        this.authHeaders
      )
      .pipe(retry(MaxRetries));
  }

  fetchAllFollowers(username: string) {
    return this.http.get<AllUserSummaryInfoResponseType>(
      BASE_URL + `/user/${username}/all_followers`,
      this.authHeaders
    );
  }

  fetchAllFollowings(username: string) {
    return this.http.get<AllUserSummaryInfoResponseType>(
      BASE_URL + `/user/${username}/all_following`,
      this.authHeaders
    );
  }
}
