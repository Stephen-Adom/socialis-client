/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType } from 'utils';
import { format } from 'date-fns';

@Component({
  selector: 'lib-comment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent {
  @Input({ required: true }) comment!: CommentType;

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }
}
