import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageAlertComponent } from './message-alert/message-alert.component';
import { MentionAlertComponent } from './mention-alert/mention-alert.component';
import { CommentAlertComponent } from './comment-alert/comment-alert.component';
import { FollowAlertComponent } from './follow-alert/follow-alert.component';
import { LikeAlertComponent } from './like-alert/like-alert.component';

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
  ],
  templateUrl: './notification-alerts.component.html',
  styleUrls: ['./notification-alerts.component.scss'],
})
export class NotificationAlertsComponent {}
