/* eslint-disable @nx/enforce-module-boundaries */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AuthenticationService } from 'services';
import { ConfirmedValidator, UserRegistrationDetailsType } from 'utils';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'feature-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  Form: FormGroup;
  validatingEmail = false;
  validatingUsername = false;
  submittingForm = false;
  registrationSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.Form = this.formBuilder.group(
      {
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    this.Form.get('email')
      ?.valueChanges.pipe(
        debounceTime(800),
        filter(
          () => this.Form.get('email')?.value && this.Form.get('email')?.valid
        )
      )
      .subscribe((value) => {
        this.checkIfEmailAlreadyExist(value);
      });

    this.Form.get('username')
      ?.valueChanges.pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((value) => {
        this.checkIfUsernameAlreadyExist(value);
      });
  }

  checkIfEmailAlreadyExist(email: string) {
    this.validatingEmail = true;

    this.authservice.validate_email_exist(email).subscribe({
      next: (response: any) => {
        this.validatingEmail = false;

        if (response['email_exist']) {
          this.Form.get('email')?.setErrors({ emailExist: true });
        } else {
          this.Form.get('email')?.setErrors(null);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.validatingEmail = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
    });
  }

  checkIfUsernameAlreadyExist(username: string) {
    this.validatingUsername = true;

    this.registrationSubscription = this.authservice
      .validate_username_exist(username)
      .subscribe({
        next: (response: any) => {
          this.validatingUsername = false;

          if (response['username_exist']) {
            this.Form.get('username')?.setErrors({ usernameExist: true });
          } else {
            this.Form.get('username')?.setErrors(null);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.validatingUsername = false;
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
          console.log(error);
        },
      });
  }

  getEmailErrorMessage(control: AbstractControl<any, any> | null) {
    if (control?.hasError('email')) {
      return 'Email is invalid';
    } else if (control?.hasError('emailExist')) {
      return 'Email entered already exist';
    } else {
      return 'Email is required';
    }
  }

  getUsernameErrorMessage(control: AbstractControl<any, any> | null) {
    if (control?.hasError('usernameExist')) {
      return 'Username entered already exist';
    } else {
      return 'Username is required';
    }
  }

  register() {
    if (this.Form.valid) {
      this.submitUserDetails();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  submitUserDetails() {
    const details: UserRegistrationDetailsType = {
      firstname: this.Form.get('firstname')?.value,
      lastname: this.Form.get('lastname')?.value,
      username: this.Form.get('username')?.value,
      email: this.Form.get('email')?.value,
      password: this.Form.get('password')?.value,
    };

    this.submittingForm = true;

    this.authservice.registerUser(details).subscribe({
      next: (response) => {
        this.submittingForm = false;
        this.Form.reset();
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
    this.registrationSubscription.unsubscribe();
  }
}
