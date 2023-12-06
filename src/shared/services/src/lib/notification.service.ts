/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHttpOptions } from './httpHeaders';
import BASE_URL from './base_url';
import { AllNotificationsResponseType, SuccessMessageType } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  authHeaders: any;

  constructor(private http: HttpClient) {
    getAuthHttpOptions().then((options) => {
      this.authHeaders = options;
    });
  }

  getUserNotifications(userId: number) {
    return this.http.get<AllNotificationsResponseType>(
      BASE_URL + '/notifications/' + userId + '/all',
      this.authHeaders
    );
  }

  getUserUnreadNotificationCount(userId: number) {
    return this.http.get<{
      status: string;
      data: number;
    }>(BASE_URL + '/notifications/' + userId + '/count', this.authHeaders);
  }

  markNotificationAsRead(notificationId: number) {
    return this.http.get<SuccessMessageType>(
      BASE_URL + '/notifications/' + notificationId + '/markAsRead',
      this.authHeaders
    );
  }

  markAllNotificationAsRead(userId: number) {
    return this.http.get<SuccessMessageType>(
      BASE_URL + '/notifications/' + userId + '/markAllAsRead',
      this.authHeaders
    );
  }
}
