/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  ErrorMessageService,
  SuccessMessageService,
  ReplyService,
} from 'services';
import {
  AppState,
  getUserInformation,
  AppApiActions,
  getCommentDetails,
} from 'state';
import {
  UserInfoType,
  ERROR_MESSAGE_TOKEN,
  SUCCESS_MESSAGE_TOKEN,
  getBase64,
  CommentType,
} from 'utils';

type postImageType = {
  base64: string;
  file: File;
  id: number;
};

@Component({
  selector: 'lib-create-reply-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PickerComponent,
    ImageCropperModule,
  ],
  templateUrl: './create-reply-form.component.html',
  styleUrls: ['./create-reply-form.component.scss'],
})
export class CreateReplyFormComponent implements OnInit, OnDestroy {
  Form: FormGroup;
  authUser!: UserInfoType;
  commentDetails!: CommentType;
  replyImages: postImageType[] = [];
  submittingForm = false;
  authUserSubscription = new Subscription();
  commentDetailsSubscription = new Subscription();
  toggleEmoji = false;
  editFile: postImageType | null = null;
  edittedImage!: string;
  exitFileIndex = -1;

  constructor(
    @Inject(ERROR_MESSAGE_TOKEN) private errorMessage: ErrorMessageService,
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private replyservice: ReplyService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.nonNullable.group({
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((data) => {
        if (data) {
          this.authUser = data;
        }
      });

    this.commentDetailsSubscription = this.store
      .select(getCommentDetails)
      .subscribe((data) => {
        if (data) {
          this.commentDetails = data;
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
      this.replyImages.push({
        base64: base64String,
        file: file,
        id: Math.ceil(Math.random() * 1000),
      });
    }
  }

  removeImage(imageId: number) {
    this.replyImages = this.replyImages.filter((image) => image.id !== imageId);
  }

  submitComment() {
    if (this.Form.valid || this.replyImages.length > 0) {
      this.submitPostToDb();
    } else {
      this.Form.markAllAsTouched();
      this.errorMessage.sendErrorMessage({
        message: 'Enter reply or upload images',
        error: 'BAD_REQUEST',
      });
    }
  }

  submitPostToDb() {
    this.submittingForm = true;

    const imageForms: any = this.replyImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);
    formData.append('user_id', this.authUser.id.toString());
    formData.append('comment_id', this.commentDetails.id.toString());

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.replyservice.createReply(formData).subscribe({
      next: (response: any) => {
        this.submittingForm = false;
        this.successMessage.sendSuccessMessage(response['message']);
        this.clearPostForm();
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
    this.replyImages = [];
    this.toggleEmoji = false;
  }

  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
    this.commentDetailsSubscription.unsubscribe();
  }

  editImage(image: postImageType, index: number) {
    this.editFile = image;
    this.exitFileIndex = index;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.edittedImage = <string>event.objectUrl;
    console.log(this.edittedImage);
  }

  cancelEdit() {
    this.editFile = null;
    this.edittedImage = '';
    this.exitFileIndex = -1;
  }

  saveEditChanges() {
    if (this.edittedImage) {
      const updatedFile: postImageType = {
        base64: this.edittedImage,
        file: new File([], ''),
        id: <number>this.editFile?.id,
      };

      this.urlToFile(this.edittedImage).then((file) => {
        updatedFile.file = file;
      });

      this.replyImages.splice(this.exitFileIndex, 1, updatedFile);

      this.cancelEdit();
    }
  }

  async urlToFile(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return new File([blob], filename, { type: blob.type });
  }
}
