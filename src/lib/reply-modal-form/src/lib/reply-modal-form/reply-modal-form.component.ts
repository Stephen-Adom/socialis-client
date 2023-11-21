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
  AppApiActions,
  PostApiActions,
  PostState,
  getCommentDetails,
  getEditReplyDetails,
  getPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import {
  CommentType,
  ERROR_MESSAGE_TOKEN,
  PostType,
  ReplyType,
  SUCCESS_MESSAGE_TOKEN,
  UserInfoType,
  getBase64,
} from 'utils';
import { Observable, Subscription } from 'rxjs';
import { format, formatDistanceToNow } from 'date-fns';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ErrorMessageService,
  SuccessMessageService,
  ReplyService,
} from 'services';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { TextareaFormComponent } from 'textarea-form';
import { CalendarComponent } from 'calendar';

type postImageType = {
  base64: string;
  file: File;
  id: number;
};

@Component({
  selector: 'lib-reply-modal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PickerComponent,
    ImageCropperModule,
    TextareaFormComponent,
    CalendarComponent
  ],
  templateUrl: './reply-modal-form.component.html',
  styleUrls: ['./reply-modal-form.component.css'],
})
export class ReplyModalFormComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('fileInput3') fileInput3!: ElementRef<HTMLInputElement>;
  comment$!: Observable<CommentType | null>;
  Form: FormGroup;
  replyImages: postImageType[] = [];
  toggleEmoji = false;
  submittingForm = false;
  userInfoSubscription = new Subscription();
  postDetailsSubscription = new Subscription();
  editReplySubscription = new Subscription();
  authUser!: UserInfoType;
  postDetails!: PostType;
  editReply!: ReplyType | null;
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
    private replyservice: ReplyService,
    private formBuilder: FormBuilder,
    private store: Store<PostState>
  ) {
    this.Form = this.formBuilder.nonNullable.group({
      content: ['', Validators.required],
      scheduledAt: [''],
    });
  }

  ngOnInit(): void {
    this.comment$ = this.store.select(getCommentDetails);
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.authUser = userInfo;
        }
      });

    this.postDetailsSubscription = this.store
      .select(getPostDetails)
      .subscribe((data) => {
        if (data) {
          this.postDetails = data;
        }
      });

    this.editReplySubscription = this.store
      .select(getEditReplyDetails)
      .subscribe((data) => {
        if (data) {
          this.editReply = data;
          this.setFormValues(data);
        }
      });
  }

  sendSelectedDate(event: Date) {
    this.Form.get('scheduledAt')?.setValue(new Date(event));
    this.formattedScheduledDate = format(event, 'MMMM do, yyyy');
    this.formattedScheduledTime = format(event, 'h:mm a');
  }

  setModalHide(event: boolean) {
    this.toggleCalendar = event;
  }

  removeDate() {
    this.Form.get('scheduledAt')?.setValue('');
  }

  setFormValues(data: ReplyType) {
    this.Form.get('content')?.setValue(data.content);
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
      this.fileInput3.nativeElement.value = '';
    }
  }

  removeImage(imageId: number) {
    this.replyImages = this.replyImages.filter((image) => image.id !== imageId);
  }

  formatPostDate(post: CommentType) {
    return formatDistanceToNow(new Date(post.createdAt), {
      includeSeconds: true,
    });
  }

  clearPostForm() {
    this.store.dispatch(PostApiActions.completeEditComment());
    this.Form.reset();
    this.replyImages = [];
    this.toggleEmoji = false;
    this.editReply = null;
  }

  submitPost() {
    if (this.Form.valid || this.replyImages.length > 0) {
      if (this.editReply) {
        this.submitEditPostToDb();
      } else {
        this.submitPostToDb();
      }
    } else {
      this.Form.markAllAsTouched();
      this.errorMessage.sendErrorMessage({
        message: 'Enter Post or upload images',
        error: 'BAD_REQUEST',
      });
    }
  }

  submitEditPostToDb() {
    this.submittingForm = true;

    const imageForms: any = this.replyImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.replyservice
      .editReply(<number>this.editReply?.id, formData)
      .subscribe({
        next: (response: any) => {
          this.submittingForm = false;
          this.successMessage.sendSuccessMessage(response['message']);
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

  submitPostToDb() {
    this.submittingForm = true;
    let comment!: CommentType;

    this.comment$.subscribe((data) => {
      if (data) {
        comment = data;
      }
    });

    const imageForms: any = this.replyImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);
    formData.append('user_id', this.authUser.id.toString());
    formData.append('comment_id', comment.id.toString());

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.replyservice.createReply(formData).subscribe({
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

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
    this.postDetailsSubscription.unsubscribe();
    this.editReplySubscription.unsubscribe();
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
