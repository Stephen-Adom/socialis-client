import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-success-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-notification.component.html',
  styleUrls: ['./success-notification.component.scss'],
})
export class SuccessNotificationComponent {}
