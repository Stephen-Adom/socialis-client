/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
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
export class EditAuthProfileModalComponent {
  Form: FormGroup;
  validatingUsername = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat.International;
  preferredCountries: CountryISO[] = [
    CountryISO.Ghana,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];

  constructor(private formBuilder: FormBuilder) {
    this.Form = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      bio: [''],
      address: [''],
      phonenumber: [''],
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
}
