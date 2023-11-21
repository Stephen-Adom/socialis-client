/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationOffcanvasService } from 'services';
import { SidebarModule } from 'primeng/sidebar';
import { Subscription, tap } from 'rxjs';
import { UserApiActions, UserState, getAllUserNotifications, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Notifications, UserInfoType } from 'utils';
import { DomSanitizer } from '@angular/platform-browser';
import { format, formatDistance } from 'date-fns';

type formattedNotifications = {
  id: number;
  message: string;
  source: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    username: string;
    imageUrl: string;
  }
  target: {
    targetContent?: string;
    targetUid: string;
    targetImage: string;
    targetFirstname?: string;
    targetLastname?: string;
    targetUsername?: string;
  };
  readAt: string;
  createdAt: string;
  read: boolean;
  activityType: string;
  targetType: string;
}

type groupedNotificationType = {
  [key: string]: formattedNotifications[]
}

type groupedDateNotificationType = {
  [key: string]: Notifications[];
}

type sourceType = {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  username: string;
  imageUrl: string;
}


@Component({
  selector: 'lib-notification-offcanvas',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  templateUrl: './notification-offcanvas.component.html',
  styleUrls: ['./notification-offcanvas.component.css'],
})
export class NotificationOffcanvasComponent implements OnInit, OnDestroy {
  sidebarVisible!: boolean;
  offcanvasSubscription = new Subscription();
  userInfoSubscription = new Subscription();
  allNotificationsSubscription = new Subscription();
  groupedNotifications: groupedNotificationType = {};
  NotificationActivities = {
    LIKED: "LIKED",
    COMMENTED: "COMMENTED",
    REPLY: "REPLY",
    FOLLOWS: "FOLLOWS",
    FRIEND_REQUEST: "FRIEND_REQUEST",
    MENTION: "MENTION",
    MESSAGE: "MESSAGE"
  }
  authUser!: UserInfoType;

  constructor(private offcanvasService: NotificationOffcanvasService, private sanitizer: DomSanitizer, private store: Store<UserState>) { }

  ngOnInit(): void {
    this.userInfoSubscription = this.store.select(getUserInformation).pipe(
      tap(user => {
        if (user) {
          this.authUser = user;
          this.store.dispatch(UserApiActions.fetchNotifications({ userId: user.id }));
        }
      })
    ).subscribe()

    this.allNotificationsSubscription = this.store.select(getAllUserNotifications).subscribe(notifications => {
      if (notifications.length) {
        this.groupNotifications(notifications)
      }
    })


    this.offcanvasSubscription =
      this.offcanvasService.toggleOffcanvasVisibilityObservable.subscribe(
        (state) => {
          this.sidebarVisible = state;
        }
      );
  }

  onHide() {
    this.offcanvasService.toggleOffcanvas(false);
  }

  groupNotifications(notifications: Notifications[]) {

    let groupedNotifications: groupedDateNotificationType = {};

    groupedNotifications = notifications.reduce((acc: any, currentItem: Notifications) => {
      const groupKey = currentItem.createdAt.split('T')[0];

      if (acc[groupKey]) {
        acc[groupKey] = [...acc[groupKey], currentItem]
      } else {
        acc[groupKey] = [currentItem]
      }

      return acc

    }, {});

    const dateKeys = Object.keys(groupedNotifications);
    Object.values(groupedNotifications).forEach((notificationArr, index) => {
      const formattedNotifications: formattedNotifications[] = [];

      const sourceTargetMap = notificationArr.reduce((acc: any, notificationItem: Notifications) => {
        const { source, target } = notificationItem;

        if (acc[target.targetUid]) {
          acc[target.targetUid].push(source)
        } else {
          acc[target.targetUid] = [source]
        }

        return acc;
      }, {});

      Object.entries(sourceTargetMap).forEach(([targetId, sources]) => {
        const notification = notificationArr.find((item: Notifications) => item.target.targetUid === targetId);

        if (notification) {
          formattedNotifications.push(this.formatNotificationMessage(notification, sources as sourceType[]));
        }
      })

      this.groupedNotifications[dateKeys[index]] = formattedNotifications;
    })

    // console.log(this.groupedNotifications, 'groupedNotifications');
  }

  formatNotificationMessage(notification: Notifications, sources: sourceType[]) {
    let message = '';
    switch (notification.activityType) {
      case this.NotificationActivities.MENTION:
        message = `<a href="" class="font-bold italic text-primaryColor">${notification.source.firstname} ${notification.source.lastname}</a> mentioned you in a <a href="" class="font-bold italic text-primaryColor">${this.getTargetType(notification)}</a>`;
        break;

      case this.NotificationActivities.COMMENTED:
        message = `<a href="" class="font-bold italic text-primaryColor">${this.getSourceUsername(this.authUser, notification.source)}</a> commented: <a href="" class="font-bold italic font-primaryColor">${notification.target.targetContent}</a>`;
        break;

      case this.NotificationActivities.FOLLOWS:
        if (sources.length === 1) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> started following you`;
        } else if (sources.length === 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> and <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> started following you`;
        } else if (sources.length > 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a>, <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> and ${sources.length - 2} others started following you`;
        }

        break;
      case this.NotificationActivities.LIKED:
        if (sources.length === 1) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> liked your <a href="" class="font-bold text-primaryColor italic">${this.getTargetType(notification)}</a>`;
        } else if (sources.length === 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> and <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> liked your <a href="" class="font-bold text-primaryColor italic">${this.getTargetType(notification)}</a>`;
        } else if (sources.length > 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a>, <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> and ${sources.length - 2} others liked your <a href="" class="font-bold text-primaryColor italic">${this.getTargetType(notification)}</a>`;
        }
        break;
      case this.NotificationActivities.REPLY:
        if (sources.length === 1) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> replied to your comment: <a href="" class="font-bold italic text-primaryColor">${notification.target.targetContent}</a>`;
        } else if (sources.length === 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> and <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> replied to your comment: <a href="" class="font-bold italic text-primaryColor">${notification.target.targetContent}</a>`;
        } else if (sources.length > 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a>, <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> and ${sources.length - 2} others replied to your comment: <a href="" class="font-bold italic text-primaryColor">${notification.target.targetContent}</a>`;
        }

        break;
      case this.NotificationActivities.MESSAGE:
        if (sources.length === 1) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> sent you a message`;
        } else if (sources.length === 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> and <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> sent you a message`;
        } else if (sources.length > 2) {
          message = `<a href="" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a>, <a href="" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> and ${sources.length - 2} others sent you a message`;
        }

        break;

      default:
        break;
    }

    const notificationObj: formattedNotifications = {
      id: notification.id,
      message,
      source: notification.source,
      target: notification.target,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      read: notification.read,
      activityType: notification.activityType,
      targetType: notification.targetType
    }
    return notificationObj;
  }

  getTargetType(notification: Notifications) {
    switch (notification.targetType) {
      case 'USER':
        return "user";
      case "POST":
        return "post"
      case "COMMENT":
        return "comment"
      case "REPLY":
        return "reply"
      default:
        return ""
    }
  }

  getSourceUsername(authUser: UserInfoType, source: sourceType) {
    if (source.uid === authUser.uid) {
      return `You`;
    } else {
      return `${source.firstname} ${source.lastname}`;
    }

  }

  // formatTargetType(notification: Notifications){
  //   switch (notification.targetType) {
  //     case 'USER':
  //       return `<a href="" class="font-bold italic text-primaryColor">${notification.target.firstname} ${notification.target.lastname}</a>`;
  //     case "POST":
  //       return `<a href="" class="font-bold italic text-primaryColor">${notification.target.targetContent}</a>`
  //       break;
  //     case "COMMENT":

  //       break;
  //     case "REPLY":

  //       break;

  //     default:
  //       break;
  //   }
  // }

  getGroupedKeys(grouped: groupedNotificationType) {
    return Object.keys(grouped);
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, content)
  }

  formateTime(createdAt: string) {
    return formatDistance(
      new Date(),
      new Date(createdAt),
      { includeSeconds: true }
    );
  }

  formatGroupDate(groupDate: string) {
    if (new Date(groupDate).getDate() === new Date().getDate()) {
      return "Today";
    } else if (new Date(groupDate).getDate() === new Date().getDate() - 1) {
      return "Yesterday";
    } else {
      return format(new Date(groupDate), 'MMMM do, yyyy');
    }
  }

  ngOnDestroy(): void {
    this.offcanvasSubscription.unsubscribe();
    this.userInfoSubscription.unsubscribe();
  }
}
