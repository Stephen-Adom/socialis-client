/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageAlertComponent } from './message-alert/message-alert.component';
import { MentionAlertComponent } from './mention-alert/mention-alert.component';
import { CommentAlertComponent } from './comment-alert/comment-alert.component';
import { FollowAlertComponent } from './follow-alert/follow-alert.component';
import { LikeAlertComponent } from './like-alert/like-alert.component';
import { DisplayAlertInfoService, NotificationActivities } from 'services';
import { ReplyAlertComponent } from './reply-alert/reply-alert.component';
import { Notifications } from 'utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-notification-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MessageAlertComponent,
    MentionAlertComponent,
    CommentAlertComponent,
    FollowAlertComponent,
    LikeAlertComponent,
    ReplyAlertComponent,
  ],
  templateUrl: './notification-alerts.component.html',
  styleUrls: ['./notification-alerts.component.scss'],
})
export class NotificationAlertsComponent implements OnInit {
  notificationAlert$!: Observable<Notifications | null>;
  NotificationActivities = NotificationActivities;

  constructor(private alertInfoService: DisplayAlertInfoService) {}

  ngOnInit(): void {
    this.notificationAlert$ = this.alertInfoService.alertInfoObservable;
  }
}
