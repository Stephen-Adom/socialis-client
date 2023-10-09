import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AuthenticationService,
  InnactiveAccountService,
  SuccessMessageService,
} from 'services';
import { AppApiActions, AppState } from 'state';
import { SUCCESS_MESSAGE_TOKEN } from 'utils';

@Component({
  selector: 'feature-verify-email-address',
  templateUrl: './verify-email-address.component.html',
  styleUrls: ['./verify-email-address.component.scss'],
})
export class VerifyEmailAddressComponent implements OnInit {
  validatingEmailToken = false;
  tokenInvalid = false;
  emailToken!: string;
  emailVerificationSuccess = false;
  sendingRequest = false;
  errorMessage!: string;
  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessageService: SuccessMessageService,
    private innactiveAccountService: InnactiveAccountService,
    private authservice: AuthenticationService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.emailToken = params['token'];
        this.verifyEmailToken(params['token']);
      }
    });
  }

  verifyEmailToken(token: string) {
    this.validatingEmailToken = true;
    this.authservice.verifyEmailToken(token).subscribe({
      next: (data) => {
        this.validatingEmailToken = false;
        if (data.token_valid) {
          this.innactiveAccountService.accountIsNotActive(false);
          this.successMessageService.sendSuccessMessage(
            'Email verified successfully and account is now active'
          );
          this.router.navigate(['auth/login']);
        } else {
          this.tokenInvalid = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
        this.validatingEmailToken = false;
        this.tokenInvalid = true;
      },
    });
  }

  requestEmailToken() {
    this.sendingRequest = true;
    this.authservice.sendEmailVerificationToken(this.emailToken).subscribe({
      next: (data) => {
        this.emailVerificationSuccess = true;
        this.tokenInvalid = false;
        this.sendingRequest = false;
      },
      error: (error: HttpErrorResponse) => {
        this.sendingRequest = false;

        this.errorMessage = error.error.message;
      },
    });
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }
}
