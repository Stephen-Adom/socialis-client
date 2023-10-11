import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type postImageType = {
  base64: string;
  file: File;
  id: number;
};

@Component({
  selector: 'lib-new-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-post-modal.component.html',
  styleUrls: ['./new-post-modal.component.css'],
})
export class NewPostModalComponent {
  Form: FormGroup;
  postImages: postImageType[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.Form = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  uploadImage(event: any) {
    const file = <File>event.target.files[0];
  }

  submitPost() {
    if (this.Form.valid) {
      console.log(this.Form.value);
    } else {
      this.Form.markAllAsTouched();
    }
  }
}
