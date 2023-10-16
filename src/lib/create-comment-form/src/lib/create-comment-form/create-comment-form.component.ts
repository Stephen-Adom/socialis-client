/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PostType,
  SUCCESS_MESSAGE_TOKEN,
  UserInfoType,
  getBase64,
} from 'utils';
import { CommentService, SuccessMessageService } from 'services';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AppApiActions,
  AppState,
  getPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type commentImageType = {
  base64: string;
  file: File;
  id: number;
};

@Component({
  selector: 'lib-create-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CommentService],
  templateUrl: './create-comment-form.component.html',
  styleUrls: ['./create-comment-form.component.css'],
})
export class CreateCommentFormComponent implements OnInit, OnDestroy {
  Form: FormGroup;
  authUser!: UserInfoType;
  postDetails!: PostType;
  commentImages: commentImageType[] = [];
  submittingForm = false;
  authUserSubscription = new Subscription();
  postDetailsSubscription = new Subscription();

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private commentservice: CommentService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.group({
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

    this.postDetailsSubscription = this.store
      .select(getPostDetails)
      .subscribe((data) => {
        if (data) {
          this.postDetails = data;
        }
      });
  }

  async uploadImage(event: any) {
    if (event.target.files.length) {
      const file = <File>event.target.files[0];
      const base64String = <string>await getBase64(file);
      this.commentImages.push({
        base64: base64String,
        file: file,
        id: Math.ceil(Math.random() * 1000),
      });
    }
  }

  removeImage(imageId: number) {
    this.commentImages = this.commentImages.filter(
      (image) => image.id !== imageId
    );
  }

  submitComment() {
    if (this.Form.valid) {
      this.submitCommentToDb();
    } else {
      this.Form.markAllAsTouched();
    }
  }

  submitCommentToDb() {
    this.submittingForm = true;

    const imageForms: any = this.commentImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);
    formData.append('user_id', this.authUser?.id.toString());
    formData.append('post_id', this.postDetails?.id.toString());

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.commentservice.createComment(formData).subscribe({
      next: (response) => {
        this.submittingForm = false;
        this.successMessage.sendSuccessMessage('New Comment Created!');
        this.clearCommentForm();
      },
      error: (error: HttpErrorResponse) => {
        this.submittingForm = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
    });
  }

  clearCommentForm() {
    this.Form.reset();
    this.commentImages = [];
  }

  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
    this.postDetailsSubscription.unsubscribe();
  }
}
