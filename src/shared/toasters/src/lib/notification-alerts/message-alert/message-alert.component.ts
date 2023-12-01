import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-message-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.scss'],
})
export class MessageAlertComponent {}
