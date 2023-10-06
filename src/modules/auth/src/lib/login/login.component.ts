import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'feature-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  Form: FormGroup;
  submittingForm = false;
  loginSubscription = new Subscription();

  constructor(
    private authservice: AuthenticationService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.Form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
