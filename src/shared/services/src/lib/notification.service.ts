/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuthHttpOptions } from './httpHeaders';
import BASE_URL from './base_url';
import { AllNotificationsResponseType } from 'utils';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    authHeaders: any;

    constructor(private http: HttpClient) {
        getAuthHttpOptions().then((options) => {
            this.authHeaders = options;
        });
    }

    getUserNotifications(userId: number) {
        return this.http.get<AllNotificationsResponseType>(BASE_URL + '/notifications/' + userId + '/all',
            this.authHeaders)
    }
}