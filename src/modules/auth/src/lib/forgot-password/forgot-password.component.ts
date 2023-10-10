/* eslint-disable @nx/enforce-module-boundaries */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, filter } from 'rxjs';
import { AuthenticationService, SuccessMessageService } from 'services';
import { AppApiActions, AppState } from 'state';
import { SUCCESS_MESSAGE_TOKEN } from 'utils';

@Component({
  selector: 'feature-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  Form: FormGroup;
  submittingForm = false;
  validatingEmail = false;

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessageService: SuccessMessageService,
    private authservice: AuthenticationService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
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
        this.checkIfEmailExist(value);
      });
  }

  checkIfEmailExist(email: string) {
    this.validatingEmail = true;

    this.authservice.validate_email_exist(email).subscribe({
      next: (response: any) => {
        this.validatingEmail = false;

        if (response['email_exist']) {
          this.Form.get('email')?.setErrors(null);
        } else {
          this.Form.get('email')?.setErrors({ emailNotExist: true });
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

  getEmailErrorMessage(control: AbstractControl<any, any> | null) {
    if (control?.hasError('email')) {
      return 'Email is invalid';
    } else if (control?.hasError('emailNotExist')) {
      return 'Email entered does not exist';
    } else {
      return 'Email is required';
    }
  }

  submit() {
    if (this.Form.valid) {
      this.resetPassword();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  resetPassword() {
    this.submittingForm = true;
    this.authservice.resetPassword(this.Form.get('email')?.value).subscribe({
      next: (response) => {
        this.submittingForm = false;
        this.Form.reset();
        this.successMessageService.sendSuccessMessage(response.message);
      },

      error: (error: HttpErrorResponse) => {
        this.submittingForm = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
    });
  }
}
