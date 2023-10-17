/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as localforage from 'localforage';
import {
  ErrorToasterComponent,
  SuccessNotificationComponent,
} from 'notification';
import { Subscription } from 'rxjs';
import {
  ErrorMessageService,
  SuccessMessageService,
  ValidateAuthUserService,
} from 'services';
import { AppState, getErrorMessage } from 'state';
import {
  ERROR_MESSAGE_TOKEN,
  ErrorMessageType,
  SUCCESS_MESSAGE_TOKEN,
  UserInfoType,
} from 'utils';

@Component({
  standalone: true,
  imports: [RouterModule, ErrorToasterComponent, SuccessNotificationComponent],
  providers: [
    ValidateAuthUserService,
    {
      provide: SUCCESS_MESSAGE_TOKEN,
      useClass: SuccessMessageService,
    },
    {
      provide: ERROR_MESSAGE_TOKEN,
      useClass: ErrorMessageService,
    },
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  errorMessageSubscription = new Subscription();
  errorMessage: ErrorMessageType | null = null;

  constructor(
    private validateUser: ValidateAuthUserService,
    private store: Store<AppState>
  ) {
    this.fetchDataFromStorage();
  }

  async fetchDataFromStorage() {
    try {
      const token: string | null = await localforage.getItem('accessToken');
      const userInfo: UserInfoType | null = await localforage.getItem(
        'userInfo'
      );
      const refreshToken: string | null = await localforage.getItem(
        'refreshToken'
      );
      this.validateUser.validateAuthUser(token, refreshToken, userInfo);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.errorMessageSubscription = this.store
      .select(getErrorMessage)
      .subscribe((data: ErrorMessageType | null) => {
        if (data) {
          this.errorMessage = data;
        }
      });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe;
  }
}
