import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiActions, AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  AuthenticationService,
  InnactiveAccountService,
  SuccessMessageService,
} from 'services';
import * as localforage from 'localforage';
import { HttpErrorResponse } from '@angular/common/http';
import { SUCCESS_MESSAGE_TOKEN } from 'utils';

@Component({
  selector: 'lib-activate-account-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate-account-notification.component.html',
  styleUrls: ['./activate-account-notification.component.scss'],
})
export class ActivateAccountNotificationComponent implements OnInit, OnDestroy {
  @ViewChild('activateAccountNotification')
  activateAccountNotification!: ElementRef<HTMLDivElement>;
  innactiveAccount!: boolean;
  sendingLink = false;

  accountSubscription = new Subscription();

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessageService: SuccessMessageService,
    private innactiveAccountService: InnactiveAccountService,
    private authService: AuthenticationService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.accountSubscription =
      this.innactiveAccountService.innactiveAccountObservable.subscribe(
        (data) => {
          this.innactiveAccount = data;
        }
      );

    localforage.getItem('userEmail').then((email: any) => {
      if (email) {
        this.innactiveAccount = true;
      }
    });
  }

  close() {
    if (
      this.activateAccountNotification.nativeElement.classList.contains(
        'animate-normal'
      )
    ) {
      this.activateAccountNotification.nativeElement.classList.replace(
        'animate-normal',
        'animate-reverse'
      );
    }
  }

  resendEmail() {
    localforage.getItem('userEmail').then((email: any) => {
      if (email) {
        this.sendingLink = true;
        this.authService.sendEmailLink(email).subscribe({
          next: (data) => {
            this.sendingLink = false;
            this.successMessageService.sendSuccessMessage(data.message);
            console.log(data);
          },
          error: (error: HttpErrorResponse) => {
            this.sendingLink = false;
            this.store.dispatch(
              AppApiActions.displayErrorMessage({ error: error.error })
            );
            console.log(error);
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }
}
