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
import {
  ERROR_MESSAGE_TOKEN,
  PostType,
  SUCCESS_MESSAGE_TOKEN,
  UserInfoType,
  getBase64,
  postImageType,
} from 'utils';
import {
  AppApiActions,
  AppState,
  PostApiActions,
  getEditPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  ActionProgressService,
  ErrorMessageService,
  PostService,
  SuccessMessageService,
} from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { TextareaFormComponent } from 'textarea-form';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarComponent } from 'calendar';
import { format } from 'date-fns';

@Component({
  selector: 'lib-new-post-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PickerComponent,
    ImageCropperModule,
    TextareaFormComponent,
    CalendarComponent,
    TooltipModule,
  ],
  templateUrl: './new-post-modal.component.html',
  styleUrls: ['./new-post-modal.component.css'],
})
export class NewPostModalComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  Form: FormGroup;
  postImages: postImageType[] = [];
  submittingForm = false;
  authUser!: UserInfoType;
  userInfoSubscription = new Subscription();
  editPostSubscription = new Subscription();
  toggleEmoji = false;
  editPost!: PostType | null;
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
    private actionProgressService: ActionProgressService,
    private postservice: PostService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.nonNullable.group({
      content: ['', Validators.required],
      scheduledAt: [''],
    });
  }

  ngOnInit(): void {
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.authUser = userInfo;
        }
      });

    this.editPostSubscription = this.store
      .select(getEditPostDetails)
      .subscribe((post) => {
        if (post) {
          this.editPost = post;
          this.setPostDetails(post);
        }
      });
  }

  sendSelectedDate(event: Date) {
    this.Form.get('scheduledAt')?.setValue(new Date(event));
    this.formattedScheduledDate = format(event, 'MMMM do, yyyy');
    this.formattedScheduledTime = format(event, 'h:mm a');
  }

  removeDate() {
    this.Form.get('scheduledAt')?.setValue('');
  }

  setModalHide(event: boolean) {
    this.toggleCalendar = event;
  }

  setPostDetails(post: PostType) {
    this.Form.get('content')?.setValue(post.content);
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
          this.postImages.push({
            base64: base64String,
            file: event.target.files[i],
            id: Math.ceil(Math.random() * 1000),
            type: event.target.files[i].type,
          });
        }
      }

      this.fileInput.nativeElement.value = '';
    }
  }

  removeImage(imageId: number) {
    this.postImages = this.postImages.filter((image) => image.id !== imageId);
  }

  submitPost() {
    if (this.Form.valid || this.postImages.length > 0) {
      if (this.editPost) {
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
    this.closeBtn.nativeElement.click();
    this.actionProgressService.toggleSendingPostLoader(true);

    const imageForms: any = this.postImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);
    // formData.append('scheduledAt', this.Form.get('scheduledAt')?.value);

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.postservice.editPost(<number>this.editPost?.id, formData).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response['message']);
        this.clearPostForm();
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.submittingForm = false;
        this.actionProgressService.toggleSendingPostLoader(false);
      },
    });
  }

  submitPostToDb() {
    this.submittingForm = true;
    this.closeBtn.nativeElement.click();
    this.actionProgressService.toggleSendingPostLoader(true);

    const imageForms: any = this.postImages.map((image) => {
      return image.file;
    });

    const formData = new FormData();
    formData.append('content', this.Form.get('content')?.value);
    formData.append('user_id', this.authUser.id.toString());

    if (imageForms) {
      imageForms.forEach((image: any) => {
        formData.append('images', image);
      });
    } else {
      formData.append('images', '');
    }

    this.postservice.createPost(formData).subscribe({
      next: () => {
        this.successMessage.sendSuccessMessage('New Post Created!');
        this.clearPostForm();
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
        this.submittingForm = false;
        this.actionProgressService.toggleSendingPostLoader(false);
      },
      complete: () => {
        this.submittingForm = false;
        this.actionProgressService.toggleSendingPostLoader(false);
      },
    });
  }

  clearPostForm() {
    this.store.dispatch(PostApiActions.completePostEdit());
    this.Form.reset();
    this.postImages = [];
    this.editPost = null;
    this.toggleEmoji = false;
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
    this.editPostSubscription.unsubscribe();
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

      this.postImages.splice(this.exitFileIndex, 1, updatedFile);

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
