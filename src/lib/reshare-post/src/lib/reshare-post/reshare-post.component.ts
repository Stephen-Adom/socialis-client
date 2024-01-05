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
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CalendarComponent } from 'calendar';
import { TextareaFormComponent } from 'textarea-form';
import { Store } from '@ngrx/store';
import {
  ErrorMessageService,
  SuccessMessageService,
  ActionProgressService,
  PostService,
} from 'services';
import {
  AppApiActions,
  AppState,
  PostApiActions,
  getRepostInfo,
  getUserInformation,
} from 'state';
import {
  ERROR_MESSAGE_TOKEN,
  PostType,
  SUCCESS_MESSAGE_TOKEN,
  UserInfoType,
} from 'utils';
import { format } from 'date-fns';
import { Observable, Subscription } from 'rxjs';
import { OriginalContentComponent } from 'repost-card';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-reshare-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PickerComponent,
    TextareaFormComponent,
    CalendarComponent,
    OriginalContentComponent,
  ],
  templateUrl: './reshare-post.component.html',
  styleUrls: ['./reshare-post.component.css'],
})
export class ResharePostComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;
  toggleCalendar = false;
  toggleEmoji = false;
  Form: FormGroup;
  formattedScheduledDate!: string;
  formattedScheduledTime!: string;
  userInfoSubscription = new Subscription();
  authUser!: UserInfoType;
  submittingForm = false;
  repost$!: Observable<PostType | null>;

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
      postId: ['', Validators.required],
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

    this.repost$ = this.store.select(getRepostInfo);

    this.populateForm();
  }

  populateForm() {
    this.repost$.subscribe((data) => {
      if (data) {
        this.Form.get('postId')?.setValue(data.id);
      }
    });
  }

  addEmoji(event: any) {
    this.Form.get('content')?.setValue(
      this.Form.get('content')?.value + event.emoji.native
    );
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

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }

  clearPostForm() {
    this.store.dispatch(PostApiActions.clearRepost());
    this.Form.reset();
    this.toggleEmoji = false;
  }

  submitPost() {
    if (this.Form.valid) {
      this.submitPostToDb();
    } else {
      this.Form.markAllAsTouched();
      this.errorMessage.sendErrorMessage({
        message: 'Enter Post content',
        error: 'BAD_REQUEST',
      });
    }
  }

  submitPostToDb() {
    console.log(this.Form.value);
    this.submittingForm = true;
    this.closeBtn.nativeElement.click();
    this.actionProgressService.toggleSendingPostLoader(true);

    this.postservice
      .repostWithContent(this.authUser.id, this.Form.value)
      .subscribe({
        next: (response: any) => {
          this.successMessage.sendSuccessMessage(response['message']);
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
}
