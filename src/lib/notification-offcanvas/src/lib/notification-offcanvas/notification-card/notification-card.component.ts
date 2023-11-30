/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formattedNotifications } from '../notification-offcanvas.component';
import { DomSanitizer } from '@angular/platform-browser';
import { UserApiActions, UserState, getAllAuthUserFollowing } from 'state';
import { Store } from '@ngrx/store';
import { formatDistance } from 'date-fns';
import { UserSummaryInfo } from 'utils';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'lib-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'notification-info', required: true })
  notification!: formattedNotifications;
  authFollowing$!: Observable<UserSummaryInfo[]>;
  authIsFollowing$ = new BehaviorSubject<boolean>(false);

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store<UserState>
  ) {}

  ngOnInit(): void {
    this.authFollowing$ = this.store.select(getAllAuthUserFollowing);
    this.checkIfAuthIsFollowing();
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, content);
  }

  formateTime(createdAt: string) {
    return formatDistance(new Date(), new Date(createdAt), {
      includeSeconds: true,
    });
  }

  checkIfAuthIsFollowing() {
    this.authFollowing$.subscribe((followings) => {
      if (followings.length) {
        const userExist = followings.find(
          (following) => following.id === this.notification.source.id
        );

        userExist
          ? this.authIsFollowing$.next(true)
          : this.authIsFollowing$.next(false);
      }
    });
  }

  readNotification(notification: formattedNotifications) {
    this.store.dispatch(
      UserApiActions.markNotificationAsRead({ notificationId: notification.id })
    );
    window.location.href = notification.target.targetUrl as string;
  }
}
