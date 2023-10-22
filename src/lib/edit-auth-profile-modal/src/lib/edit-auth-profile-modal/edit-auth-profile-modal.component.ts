import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from 'auth';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'lib-edit-auth-profile-modal',
  standalone: true,
  imports: [CommonModule, ErrorMessageComponent, ReactiveFormsModule],
  templateUrl: './edit-auth-profile-modal.component.html',
  styleUrls: ['./edit-auth-profile-modal.component.css'],
})
export class EditAuthProfileModalComponent {
  Form: FormGroup;
  validatingUsername = false;

  constructor(private formBuilder: FormBuilder) {
    this.Form = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      bio: [''],
      location: [''],
      phonenumber: [''],
    });
  }
}
