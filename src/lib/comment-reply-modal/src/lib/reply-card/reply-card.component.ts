/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyType } from 'utils';
import { format } from 'date-fns';

@Component({
  selector: 'lib-reply-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reply-card.component.html',
  styleUrls: ['./reply-card.component.scss'],
})
export class ReplyCardComponent {
  @Input({ required: true }) reply!: ReplyType;

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }
}
