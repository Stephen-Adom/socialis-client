/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { UserState, getUserInformation } from 'state';
import { Notifications, UserInfoType } from 'utils';

export type sourceType = {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  username: string;
  imageUrl: string;
};

export const NotificationActivities = {
  LIKED: 'LIKED',
  COMMENTED: 'COMMENTED',
  REPLY: 'REPLY',
  FOLLOWS: 'FOLLOWS',
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  MENTION: 'MENTION',
  MESSAGE: 'MESSAGE',
};

export type formattedNotifications = {
  id: number;
  message: string;
  source: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    username: string;
    imageUrl: string;
  };
  target: {
    targetContent?: string;
    targetUid: string;
    targetImage: {
      id: number;
      mediaUrl: string;
      mediaType: string;
    };
    targetFirstname?: string;
    targetLastname?: string;
    targetUsername?: string;
    targetUrl?: string;
  };
  readAt: string;
  createdAt: string;
  read: boolean;
  activityType: string;
  targetType: string;
};

@Injectable({
  providedIn: 'root',
})
export class FormatNotificationService {
  NotificationActivities = NotificationActivities;
  userInfoSubscription = new Subscription();
  authUser!: UserInfoType;

  constructor(private store: Store<UserState>) {
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .pipe(
        tap((user) => {
          if (user) {
            this.authUser = user;
          }
        })
      )
      .subscribe();
  }

  formatNotificationMessage(
    notification: Notifications,
    sources: sourceType[]
  ) {
    let message = '';
    switch (notification.activityType) {
      case this.NotificationActivities.MENTION:
        message = `<a href="user/${
          notification.source.username
        }/profile" class="font-bold italic text-primaryColor">${
          notification.source.firstname
        } ${
          notification.source.lastname
        }</a> mentioned you in a ${this.getTargetType(
          notification
        )}: <span class="font-bold italic">${this.reduceContentLength(
          notification.target.targetContent
        )}</span>`;
        break;

      case this.NotificationActivities.COMMENTED:
        message = `<a href="user/${
          notification.source.username
        }/profile" class="font-bold italic text-primaryColor">${this.getSourceUsername(
          this.authUser,
          notification.source
        )}</a> commented: <span class="font-bold italic">${this.noContent(
          this.reduceContentLength(notification.target.targetContent),
          notification.target.targetImage
        )}</span>`;
        break;

      case this.NotificationActivities.FOLLOWS:
        if (sources.length === 1) {
          message = `<a href="user/${sources[0].username}/profile" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> started following you`;
        } else if (sources.length === 2) {
          message = `<a href="user/${sources[0].username}/profile" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> and <a href="user/${sources[1].username}/profile" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> started following you`;
        } else if (sources.length > 2) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a>, <a href="user/${
            sources[1].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[1].firstname
          } ${sources[1].lastname}</a> and ${
            sources.length - 2
          } others started following you`;
        }

        break;
      case this.NotificationActivities.LIKED:
        if (sources.length === 1) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a> reacted to your ${this.getTargetType(
            notification
          )}: <span class="font-bold italic">${this.reduceContentLength(
            notification.target.targetContent
          )}</span>`;
        } else if (sources.length === 2) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a> and <a href="user/${
            sources[1].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[1].firstname
          } ${sources[1].lastname}</a> reacted to your ${this.getTargetType(
            notification
          )}: <span class="font-bold italic">${this.reduceContentLength(
            notification.target.targetContent
          )}</span>`;
        } else if (sources.length > 2) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a>, <a href="user/${
            sources[1].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[1].firstname
          } ${sources[1].lastname}</a> and ${
            sources.length - 2
          } others reacted to your ${this.getTargetType(
            notification
          )}: <span class="font-bold italic">${this.reduceContentLength(
            notification.target.targetContent
          )}</span>`;
        }
        break;
      case this.NotificationActivities.REPLY:
        if (sources.length === 1) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${
            sources[0].lastname
          }</a> replied to your comment: <span class="font-bold italic">${this.noContent(
            this.reduceContentLength(notification.target.targetContent),
            notification.target.targetImage
          )}</span>`;
        } else if (sources.length === 2) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a> and <a href="user/${
            sources[1].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[1].firstname
          } ${
            sources[1].lastname
          }</a> replied to your comment: <span class="font-bold italic">${this.noContent(
            this.reduceContentLength(notification.target.targetContent),
            notification.target.targetImage
          )}</span>`;
        } else if (sources.length > 2) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a>, <a href="user/${
            sources[1].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[1].firstname
          } ${sources[1].lastname}</a> and ${
            sources.length - 2
          } others replied to your comment: <span class="font-bold italic">${this.noContent(
            this.reduceContentLength(notification.target.targetContent),
            notification.target.targetImage
          )}</span>`;
        }

        break;
      case this.NotificationActivities.MESSAGE:
        if (sources.length === 1) {
          message = `<a href="user/${sources[0].username}/profile" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> sent you a message`;
        } else if (sources.length === 2) {
          message = `<a href="user/${sources[0].username}/profile" class="font-bold italic text-primaryColor">${sources[0].firstname} ${sources[0].lastname}</a> and <a href="user/${sources[1].username}/profile" class="font-bold italic text-primaryColor">${sources[1].firstname} ${sources[1].lastname}</a> sent you a message`;
        } else if (sources.length > 2) {
          message = `<a href="user/${
            sources[0].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[0].firstname
          } ${sources[0].lastname}</a>, <a href="user/${
            sources[1].username
          }/profile" class="font-bold italic text-primaryColor">${
            sources[1].firstname
          } ${sources[1].lastname}</a> and ${
            sources.length - 2
          } others sent you a message`;
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
      targetType: notification.targetType,
    };
    return notificationObj;
  }

  getTargetType(notification: Notifications) {
    switch (notification.targetType) {
      case 'USER':
        return 'user';
      case 'POST':
        return 'post';
      case 'COMMENT':
        return 'comment';
      case 'REPLY':
        return 'reply';
      default:
        return '';
    }
  }

  getSourceUsername(authUser: UserInfoType, source: sourceType) {
    if (source.uid === authUser.uid) {
      return `You`;
    } else {
      return `${source.firstname} ${source.lastname}`;
    }
  }

  reduceContentLength(targetContent: string | undefined) {
    if (targetContent) {
      return targetContent.length > 45
        ? targetContent.slice(0, 45) + '...'
        : targetContent;
    }

    return '';
  }

  noContent(
    content: string,
    targetImage: {
      id: number;
      mediaUrl: string;
      mediaType: string;
    }
  ) {
    if (content) {
      return content;
    } else {
      return targetImage.mediaType === 'image'
        ? 'with an image'
        : 'with a video';
    }
  }
}
