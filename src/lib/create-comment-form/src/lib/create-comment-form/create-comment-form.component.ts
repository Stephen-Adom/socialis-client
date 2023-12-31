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
  ERROR_MESSAGE_TOKEN,
  PostType,
  SUCCESS_MESSAGE_TOKEN,
  UserInfoType,
  getBase64,
  postImageType,
} from 'utils';
import {
  CommentService,
  ErrorMessageService,
  SuccessMessageService,
} from 'services';
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
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { TextareaFormComponent } from 'textarea-form';

@Component({
  selector: 'lib-create-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PickerComponent,
    ImageCropperModule,
    TextareaFormComponent,
  ],
  templateUrl: './create-comment-form.component.html',
  styleUrls: ['./create-comment-form.component.css'],
})
export class CreateCommentFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput3') fileInput3!: ElementRef<HTMLInputElement>;
  Form: FormGroup;
  authUser!: UserInfoType;
  postDetails!: PostType;
  commentImages: postImageType[] = [];
  submittingForm = false;
  authUserSubscription = new Subscription();
  postDetailsSubscription = new Subscription();
  toggleEmoji = false;
  editFile: postImageType | null = null;
  edittedImage!: string;
  exitFileIndex = -1;
  toggleCalendar = false;
  formattedScheduledDate!: string;
  formattedScheduledTime!: string;

  constructor(
    @Inject(ERROR_MESSAGE_TOKEN) private errorMessage: ErrorMessageService,
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private commentservice: CommentService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.nonNullable.group({
      content: ['', Validators.required],
      scheduledAt: [''],
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

  removeDate() {
    this.Form.get('scheduledAt')?.setValue('');
  }

  addEmoji(event: any) {
    this.Form.get('content')?.setValue(
      this.Form.get('content')?.value + event.emoji.native
    );
  }

  async uploadImage(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > 100000000) {
          this.errorMessage.sendErrorMessage({
            message: 'File size should be less than 90 MB',
            error: 'BAD_REQUEST',
          });
          return;
        } else {
          const base64String = <string>await getBase64(event.target.files[i]);
          this.commentImages.push({
            base64: base64String,
            file: event.target.files[i],
            id: Math.ceil(Math.random() * 1000),
            type: event.target.files[i].type,
          });
        }
      }

      this.fileInput3.nativeElement.value = '';
    }
  }

  removeImage(imageId: number) {
    this.commentImages = this.commentImages.filter(
      (image) => image.id !== imageId
    );
  }

  submitComment() {
    if (this.Form.valid || this.commentImages.length > 0) {
      this.submitCommentToDb();
    } else {
      this.Form.markAllAsTouched();
      this.errorMessage.sendErrorMessage({
        message: 'Enter comment or upload images',
        error: 'BAD_REQUEST',
      });
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
        type: this.editFile?.type as string,
      };

      this.urlToFile(this.edittedImage).then((file) => {
        updatedFile.file = file;
      });

      this.commentImages.splice(this.exitFileIndex, 1, updatedFile);

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
