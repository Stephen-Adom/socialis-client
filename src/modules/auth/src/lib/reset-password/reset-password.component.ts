/* eslint-disable @nx/enforce-module-boundaries */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthenticationService, SuccessMessageService } from 'services';
import { AppApiActions, AppState } from 'state';
import { ConfirmedValidator, SUCCESS_MESSAGE_TOKEN } from 'utils';

@Component({
  selector: 'feature-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  Form: FormGroup;
  submittingForm = false;
  routeSubscription = new Subscription();
  resetToken!: string;

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessageService: SuccessMessageService,
    private authservice: AuthenticationService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.Form = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe((data) => {
      if (data['token']) {
        this.resetToken = data['token'];
      }
    });
  }

  submit() {
    if (this.Form.valid) {
      this.submitRequest();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  submitRequest() {
    this.submittingForm = true;
    const form = {
      password: this.Form.get('password')?.value,
    };

    this.authservice.changePassword(form, this.resetToken).subscribe({
      next: (response) => {
        this.submittingForm = true;
        this.Form.reset();
        this.successMessageService.sendSuccessMessage(response.message);
        this.router.navigate(['/auth/login']);
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
    this.routeSubscription.unsubscribe();
  }
}
