/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
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
      console.log(param, 'params');
      if (param['code'] !== undefined) {
        this.http
          .get(
            'http://localhost:8080/api/auth/oauth/callback?code=' +
              param['code']
          )
          .subscribe((data) => {
            console.log(data, 'token');
          });
      }
    });
  }

  signInUser(user: SocialUser) {
    this.submittingForm = true;
    this.loginSubscription = this.authservice
      .signInWithGoogleSocial(user)
      .pipe()
      .subscribe({
        next: (response) => {
          console.log(response, 'response');
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

  ngAfterViewInit(): void {
    const element = this.document.querySelector('.nsm7Bb-HzV7m-LgbsSe-BPrWId');

    console.log(element, 'element');
    if (element) {
      element.textContent = 'Sign In';
    }
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
