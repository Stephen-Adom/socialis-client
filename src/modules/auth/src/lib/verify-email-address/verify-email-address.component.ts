import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationService, InnactiveAccountService } from 'services';
import { AppApiActions, AppState } from 'state';

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
  constructor(
    private innactiveAccountService: InnactiveAccountService,
    private authservice: AuthenticationService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        console.log(params['token']);
        this.emailToken = params['token'];
        this.verifyEmailToken(params['token']);
      }
    });

    console.log('object');
  }

  verifyEmailToken(token: string) {
    this.validatingEmailToken = true;
    this.authservice.verifyEmailToken(token).subscribe({
      next: (data) => {
        this.validatingEmailToken = false;
        if (data.token_valid) {
          this.innactiveAccountService.accountIsNotActive(false);
          this.router.navigate(['auth/login']);
        } else {
          this.tokenInvalid = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error, 'error');
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
        console.log(data);
      },
      error: (error: HttpErrorResponse) => {
        this.sendingRequest = false;

        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
    });
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }
}
