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
  ErrorMessageService,
  PostService,
  SuccessMessageService,
} from 'services';
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
  authUser!: UserInfoType;
  userInfoSubscription = new Subscription();
  editPostSubscription = new Subscription();
  toggleEmoji = false;
  editPost!: PostType | null;

  constructor(
    @Inject(ERROR_MESSAGE_TOKEN) private errorMessage: ErrorMessageService,
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private postservice: PostService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.Form = this.formBuilder.nonNullable.group({
      content: ['', Validators.required],
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
      const file = <File>event.target.files[0];
      const base64String = <string>await getBase64(file);
      this.postImages.push({
        base64: base64String,
        file: file,
        id: Math.ceil(Math.random() * 1000),
      });
    }
  }

  removeImage(imageId: number) {
    this.postImages = this.postImages.filter((image) => image.id !== imageId);
  }

  submitPost() {
    if (this.Form.valid || this.postImages.length > 0) {
      this.submitPostToDb();
    } else {
      this.Form.markAllAsTouched();
      this.errorMessage.sendErrorMessage({
        message: 'Enter Post or upload images',
        error: 'BAD_REQUEST',
      });
    }
  }

  submitPostToDb() {
    this.submittingForm = true;

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
    this.store.dispatch(PostApiActions.completePostEdit());
    this.Form.reset();
    this.postImages = [];
    this.editPost = null;
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
    this.editPostSubscription.unsubscribe();
  }
}
