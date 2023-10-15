/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SUCCESS_MESSAGE_TOKEN, UserInfoType, getBase64 } from 'utils';
import { AppApiActions, AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PostService, SuccessMessageService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

type postImageType = {
  base64: string;
  file: File;
  id: number;
};

@Component({
  selector: 'lib-new-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PickerComponent],
  templateUrl: './new-post-modal.component.html',
  styleUrls: ['./new-post-modal.component.css'],
})
export class NewPostModalComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  Form: FormGroup;
  postImages: postImageType[] = [];
  submittingForm = false;
  userInfo!: UserInfoType;
  userInfoSubscription = new Subscription();
  toggleEmoji = false;

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private postservice: PostService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.userInfo = userInfo;
        }
      });
  }

  addEmoji(event: any) {
    this.Form.get('content')?.setValue(
      this.Form.get('content')?.value + event.emoji.native
    );
  }

  async uploadImage(event: any) {
    if (event.target.files.length) {
      const file = <File>event.target.files[0];
      const base64String = <string>await getBase64(file);
      this.postImages.push({
        base64: base64String,
        file: file,
        id: Math.ceil(Math.random() * 1000),
      });

      console.log(this.postImages);
    }
  }

  removeImage(imageId: number) {
    this.postImages = this.postImages.filter((image) => image.id !== imageId);
    console.log(this.postImages, 'deleted');
  }

  submitPost() {
    if (this.Form.valid) {
      this.submitPostToDb();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  submitPostToDb() {
    this.submittingForm = true;

    const imageForms: any = this.postImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);
    formData.append('user_id', this.userInfo.id.toString());

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.postservice.createPost(formData).subscribe({
      next: (response) => {
        this.submittingForm = false;
        this.successMessage.sendSuccessMessage('New Post Created!');
        this.clearPostForm();
        this.closeBtn.nativeElement.click();
      },
      error: (error: HttpErrorResponse) => {
        this.submittingForm = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
    });
  }

  clearPostForm() {
    this.Form.reset();
    this.postImages = [];
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
