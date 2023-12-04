/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @angular-eslint/no-input-rename */
import {
  Component,
  ElementRef,
  Input,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommentService,
  NotificationOffcanvasService,
  formattedNotifications,
} from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  UserState,
  PostApiActions,
  AppApiActions,
  UserApiActions,
} from 'state';
import { CommentResponseType } from 'utils';
import { Subscription } from 'rxjs';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'lib-comment-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-notification-card.component.html',
  styleUrls: ['./comment-notification-card.component.scss'],
})
export class CommentNotificationCardComponent {
  @Input({ alias: 'notification-info', required: true })
  notification!: formattedNotifications;
  @ViewChild('replyBtn') replyBtn!: ElementRef<HTMLButtonElement>;
  commentSubscription = new Subscription();
  fetchingComment = false;

  constructor(
    private offcanvasService: NotificationOffcanvasService,
    private commentservice: CommentService,
    private sanitizer: DomSanitizer,
    private store: Store<UserState>,
    private router: Router
  ) {}

  readNotification(notification: formattedNotifications, event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'A') {
      this.store.dispatch(
        UserApiActions.markNotificationAsRead({
          notificationId: notification.id,
        })
      );
      this.router.navigate([notification.target.targetUrl as string]);
      this.offcanvasService.toggleOffcanvas(false);
    }
  }

  reply(notification: formattedNotifications) {
    this.fetchingComment = true;
    this.commentSubscription = this.commentservice
      .fetchCommentById(notification?.target.targetUid as string)
      .subscribe({
        next: (comment) => {
          if (comment) {
            const commentObj = comment as unknown as CommentResponseType;
            this.store.dispatch(
              PostApiActions.getCommentDetails({ comment: commentObj.data })
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
        complete: () => {
          this.store.dispatch(
            UserApiActions.markNotificationAsRead({
              notificationId: notification.id,
            })
          );
          this.fetchingComment = false;
          this.replyBtn.nativeElement.click();
          this.offcanvasService.toggleOffcanvas(false);
          this.commentSubscription.unsubscribe();
        },
      });
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, content);
  }

  formateTime(createdAt: string) {
    return formatDistance(new Date(), new Date(createdAt), {
      includeSeconds: true,
    });
  }
}
