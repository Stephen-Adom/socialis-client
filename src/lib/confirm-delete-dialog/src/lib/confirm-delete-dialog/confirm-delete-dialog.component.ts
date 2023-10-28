/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiActions, PostApiActions, PostState } from 'state';
import {
  ActionProgressService,
  CommentService,
  ConfirmDeleteService,
  PostService,
  ReplyService,
  SuccessMessageService,
  dataDeleteObject,
} from 'services';
import { SUCCESS_MESSAGE_TOKEN } from 'utils';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;
  postData!: dataDeleteObject | null;

  constructor(
    private router: Router,
    private store: Store<PostState>,
    private postservice: PostService,
    private replyservice: ReplyService,
    private commentservice: CommentService,
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private confirmDeleteService: ConfirmDeleteService,
    private actionProgessService: ActionProgressService
  ) {}

  ngOnInit(): void {
    this.confirmDeleteService.deletePostObservable.subscribe((data) => {
      if (data) {
        this.postData = data;
      }
    });
  }

  deleteData() {
    switch (this.postData?.type) {
      case 'post':
        this.deletePost(this.postData.data);
        this.clearData();
        break;

      case 'comment':
        this.deleteComment(this.postData.data);
        this.clearData();
        break;

      case 'reply':
        this.deleteReply(this.postData.data);
        this.clearData();
        break;

      default:
        break;
    }
  }

  clearData() {
    this.postData = null;
    this.closeBtn.nativeElement.click();
  }

  deletePost(postId: number) {
    this.store.dispatch(PostApiActions.deletePost({ postId }));
    if (this.router.url.includes('details')) {
      this.router.navigate(['/feeds']);
    }
    this.actionProgessService.toggleActionInProgress(true);
    this.postservice.deletePost(postId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.actionProgessService.toggleActionInProgress(false);
      },
    });
  }

  deleteComment(commentId: number) {
    this.store.dispatch(PostApiActions.deleteComment({ commentId }));

    this.actionProgessService.toggleActionInProgress(true);

    this.commentservice.deleteComment(commentId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.actionProgessService.toggleActionInProgress(false);
      },
    });
  }

  deleteReply(replyId: number) {
    this.store.dispatch(PostApiActions.deleteReply({ replyId }));

    this.actionProgessService.toggleActionInProgress(true);

    this.replyservice.deleteReply(replyId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.actionProgessService.toggleActionInProgress(false);
      },
    });
  }
}
