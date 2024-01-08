/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'services';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { SocialUser } from 'utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'feature-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  Form: FormGroup;
  submittingForm = false;
  loginSubscription = new Subscription();
  socialUser!: SocialUser;
  redirecturl = '';
  googleAuthUrl$!: Observable<{ url: string }>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.Form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.googleAuthUrl$ = this.authservice.getGoogleUrl();

    this.route.queryParams.subscribe((param: any) => {
      if (param['code'] !== undefined) {
        this.submittingForm = true;
        this.authservice
          .validateGoogleAuthenticationCode(param['code'])
          .subscribe(
            (response) => {
              this.submittingForm = false;
              this.authservice.saveAndRedirectUser(response);
            },
            (error) => {
              this.submittingForm = false;
              this.store.dispatch(
                AppApiActions.displayErrorMessage({ error: error.error })
              );
            }
          );
      }
    });
  }

  login() {
    if (this.Form.valid) {
      this.submitUserInfoToLogin();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  submitUserInfoToLogin() {
    this.submittingForm = true;

    this.loginSubscription = this.authservice
      .loginUser(this.Form.value)
      .subscribe({
        next: (response) => {
          this.submittingForm = false;
          this.authservice.saveAndRedirectUser(response);
        },
        error: (error: HttpErrorResponse) => {
          this.submittingForm = false;
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
      });
  }

  // facebookLogin() {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  googleLogin() {
    this.googleAuthUrl$.subscribe((googleUrl) => {
      if (googleUrl.url) {
        window.location.href = googleUrl.url;
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
