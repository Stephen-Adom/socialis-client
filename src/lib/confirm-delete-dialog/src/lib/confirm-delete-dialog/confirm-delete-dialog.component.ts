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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'lib-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
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
    private actionProgessService: ActionProgressService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.confirmDeleteService.deletePostObservable.subscribe((data) => {
      if (data) {
        this.postData = data;
        this.confirm();
      }
    });
  }

  confirm() {
    this.confirmationService.confirm({
      accept: () => {
        this.deleteData();
      },
      reject: () => {
        this.clearData();
        return;
      },
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
  }

  deletePost(postId: number) {
    this.store.dispatch(PostApiActions.deletePost({ postId }));
    if (this.router.url.includes('details')) {
      this.router.navigate(['/feeds']);
    }
    this.actionProgessService.toggleSendingPostLoader(true);
    this.postservice.deletePost(postId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
        this.actionProgessService.toggleSendingPostLoader(false);
      },
      complete: () => {
        this.actionProgessService.toggleSendingPostLoader(false);
      },
    });
  }

  deleteComment(commentId: number) {
    this.store.dispatch(PostApiActions.deleteComment({ commentId }));

    this.actionProgessService.toggleSendingPostLoader(true);

    this.commentservice.deleteComment(commentId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
        this.actionProgessService.toggleSendingPostLoader(false);
      },
      complete: () => {
        this.actionProgessService.toggleSendingPostLoader(false);
      },
    });
  }

  deleteReply(replyId: number) {
    this.store.dispatch(PostApiActions.deleteReply({ replyId }));

    this.actionProgessService.toggleSendingPostLoader(true);

    this.replyservice.deleteReply(replyId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
        this.actionProgessService.toggleSendingPostLoader(false);
      },
      complete: () => {
        this.actionProgessService.toggleSendingPostLoader(false);
      },
    });
  }
}
