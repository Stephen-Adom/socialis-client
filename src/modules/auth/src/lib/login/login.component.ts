/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { DOCUMENT } from '@angular/common';
import { SocialUser } from 'utils';

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private socialAuthService: SocialAuthService,
    private authservice: AuthenticationService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.Form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((data) => {
      if (data) {
        this.socialUser = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          photoUrl: data.photoUrl,
        };

        this.signInUser(this.socialUser);
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

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
