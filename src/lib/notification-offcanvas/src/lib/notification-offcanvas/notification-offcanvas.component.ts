/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormatNotificationService,
  NotificationActivities,
  NotificationOffcanvasService,
  formattedNotifications,
  sourceType,
} from 'services';
import { SidebarModule } from 'primeng/sidebar';
import { Observable, Subscription, tap } from 'rxjs';
import {
  UserApiActions,
  UserState,
  getAllUserNotifications,
  getUnreadNotificationTotalCount,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { Notifications, UserInfoType } from 'utils';
import { DomSanitizer } from '@angular/platform-browser';
import { format, formatDistance } from 'date-fns';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { Router, RouterLink } from '@angular/router';

type groupedNotificationType = {
  [key: string]: formattedNotifications[];
};

type groupedDateNotificationType = {
  [key: string]: Notifications[];
};

@Component({
  selector: 'lib-notification-offcanvas',
  standalone: true,
  imports: [CommonModule, SidebarModule, NotificationCardComponent, RouterLink],
  templateUrl: './notification-offcanvas.component.html',
  styleUrls: ['./notification-offcanvas.component.css'],
})
export class NotificationOffcanvasComponent implements OnInit, OnDestroy {
  sidebarVisible!: boolean;
  offcanvasSubscription = new Subscription();
  userInfoSubscription = new Subscription();
  allNotificationsSubscription = new Subscription();
  groupedNotifications: groupedNotificationType = {};
  NotificationActivities = NotificationActivities;
  authUser!: UserInfoType;
  unreadNotificationCount$!: Observable<number>;

  constructor(
    private offcanvasService: NotificationOffcanvasService,
    private formatNotificationService: FormatNotificationService,
    private sanitizer: DomSanitizer,
    private store: Store<UserState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .pipe(
        tap((user) => {
          if (user) {
            this.authUser = user;
            this.store.dispatch(
              UserApiActions.fetchNotifications({ userId: user.id })
            );
          }
        })
      )
      .subscribe();

    this.allNotificationsSubscription = this.store
      .select(getAllUserNotifications)
      .subscribe((notifications) => {
        if (notifications.length) {
          this.groupNotifications(notifications);
        }
      });

    this.offcanvasSubscription =
      this.offcanvasService.toggleOffcanvasVisibilityObservable.subscribe(
        (state) => {
          this.sidebarVisible = state;
        }
      );

    this.unreadNotificationCount$ = this.store.select(
      getUnreadNotificationTotalCount
    );
  }

  onHide() {
    this.offcanvasService.toggleOffcanvas(false);
  }

  groupNotifications(notifications: Notifications[]) {
    let groupedNotifications: groupedDateNotificationType = {};

    groupedNotifications = notifications.reduce(
      (acc: any, currentItem: Notifications) => {
        const groupKey = currentItem.createdAt.split('T')[0];

        if (acc[groupKey]) {
          acc[groupKey] = [...acc[groupKey], currentItem];
        } else {
          acc[groupKey] = [currentItem];
        }

        return acc;
      },
      {}
    );

    const dateKeys = Object.keys(groupedNotifications);
    Object.values(groupedNotifications).forEach((notificationArr, index) => {
      const formattedNotifications: formattedNotifications[] = [];

      const sourceTargetMap = notificationArr.reduce(
        (acc: any, notificationItem: Notifications) => {
          const { source, target } = notificationItem;

          if (acc[target.targetUid]) {
            acc[target.targetUid].push(source);
          } else {
            acc[target.targetUid] = [source];
          }

          return acc;
        },
        {}
      );

      Object.entries(sourceTargetMap).forEach(([targetId, sources]) => {
        const notification = notificationArr.find(
          (item: Notifications) => item.target.targetUid === targetId
        );

        if (notification) {
          formattedNotifications.push(
            this.formatNotificationService.formatNotificationMessage(
              notification,
              sources as sourceType[]
            )
          );
        }
      });

      this.groupedNotifications[dateKeys[index]] = formattedNotifications;
    });

    console.log(this.groupedNotifications, 'groupedNotifications');
  }

  getGroupedKeys(grouped: groupedNotificationType) {
    return Object.keys(grouped);
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, content);
  }

  formateTime(createdAt: string) {
    return formatDistance(new Date(), new Date(createdAt), {
      includeSeconds: true,
    });
  }

  formatGroupDate(groupDate: string) {
    if (new Date(groupDate).getDate() === new Date().getDate()) {
      return 'Today';
    } else if (new Date(groupDate).getDate() === new Date().getDate() - 1) {
      return 'Yesterday';
    } else {
      return format(new Date(groupDate), 'MMMM do, yyyy');
    }
  }

  readNotification(notification: formattedNotifications) {
    this.store.dispatch(
      UserApiActions.markNotificationAsRead({ notificationId: notification.id })
    );
    this.router.navigate([notification.target.targetUrl as string]);
    this.offcanvasService.toggleOffcanvas(false);
    // window.location.href = ;
  }

  ngOnDestroy(): void {
    this.offcanvasSubscription.unsubscribe();
    this.userInfoSubscription.unsubscribe();
  }
}
