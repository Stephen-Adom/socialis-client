/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from 'auth';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CountryISO,
  NgxIntlTelInputModule,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { AppApiActions, AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { SUCCESS_MESSAGE_TOKEN, UserInfoType } from 'utils';
import {
  AuthenticationService,
  SuccessMessageService,
  UserService,
} from 'services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-edit-auth-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    ErrorMessageComponent,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: './edit-auth-profile-modal.component.html',
  styleUrls: ['./edit-auth-profile-modal.component.css'],
})
export class EditAuthProfileModalComponent implements OnInit, OnDestroy {
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  Form: FormGroup;
  validatingUsername = false;
  validatingPhonenumber = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat.International;
  preferredCountries: CountryISO[] = [
    CountryISO.Ghana,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  userInfoSubscription = new Subscription();
  registrationSubscription = new Subscription();
  phoneSubscription = new Subscription();
  userInfo!: UserInfoType;
  submittingForm = false;

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private authservice: AuthenticationService,
    private userserivce: UserService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      bio: [''],
      address: [''],
      phonenumber: [''],
    });
  }

  ngOnInit(): void {
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.Form.patchValue(userInfo);
          this.userInfo = userInfo;
        }
      });

    this.Form.get('username')
      ?.valueChanges.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        filter(
          () =>
            this.Form.get('username')?.value && this.Form.get('username')?.valid
        )
      )
      .subscribe((value) => {
        if (this.userInfo) {
          if (value !== this.userInfo.username) {
            this.checkIfUsernameAlreadyExist(value);
          }
        }
      });

    this.Form.get('phonenumber')
      ?.valueChanges.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        filter(
          () =>
            this.Form.get('phonenumber')?.value &&
            this.Form.get('phonenumber')?.valid
        )
      )
      .subscribe((value) => {
        if (this.userInfo) {
          if (value['internationalNumber'] !== this.userInfo.phonenumber) {
            this.checkIfPhonenumberAlreadyExist(value['internationalNumber']);
          }
        }
      });
  }

  checkIfPhonenumberAlreadyExist(phonenumber: string) {
    this.validatingPhonenumber = true;

    this.phoneSubscription = this.authservice
      .validate_phone_exist(phonenumber)
      .subscribe({
        next: (response: any) => {
          this.validatingPhonenumber = false;

          if (response['phone_exist']) {
            this.Form.get('phonenumber')?.setErrors({ phoneExist: true });
          } else {
            this.Form.get('phonenumber')?.setErrors(null);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.validatingPhonenumber = false;
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
        },
      });
  }

  getUsernameErrorMessage(control: AbstractControl<any, any> | null) {
    if (control?.hasError('usernameExist')) {
      return 'Username entered already exist';
    } else {
      return 'Username is required';
    }
  }

  getPhoneErrorMessage(control: AbstractControl<any, any> | null) {
    if (control?.hasError('phoneExist')) {
      return 'Phonenumber entered already exist';
    }

    return '';
  }

  submitInfo() {
    if (this.Form.valid) {
      this.updateUserInfo();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  updateUserInfo() {
    this.submittingForm = true;

    const form = {
      firstname: this.Form.get('firstname')?.value,
      lastname: this.Form.get('lastname')?.value,
      username: this.Form.get('username')?.value,
      bio: this.Form.get('bio')?.value,
      phonenumber: this.Form.get('phonenumber')?.value
        ? this.Form.get('phonenumber')?.value['internationalNumber']
        : '',
      address: this.Form.get('address')?.value,
    };

    this.userserivce.updateUserInfo(form, this.userInfo.id).subscribe({
      next: (response: any) => {
        this.submittingForm = false;
        console.log(response);
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.submittingForm = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.submittingForm = false;
        this.closeButton.nativeElement.click();
      },
    });
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
    this.registrationSubscription.unsubscribe();
    this.phoneSubscription.unsubscribe();
  }
}
