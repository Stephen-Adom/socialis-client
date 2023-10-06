import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AuthenticationService } from 'services';
import { ConfirmedValidator } from 'utils';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'feature-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  Form: FormGroup;
  validatingEmail = false;

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private store: Store<AppState>
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
        console.log(value);
      });

    this.checkIfEmailAlreadyExist('');
  }

  checkIfEmailAlreadyExist(email: string) {
    this.validatingEmail = true;

    this.authservice.validate_email_exist(email).subscribe({
      next: (response: any) => {
        this.validatingEmail = false;
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        this.validatingEmail = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
        console.log(error);
      },
    });
  }

  register() {
    if (this.Form.valid) {
      console.log(this.Form.value);
    } else {
      this.Form.markAllAsTouched();
    }
    console.log(this.Form);
  }
}
