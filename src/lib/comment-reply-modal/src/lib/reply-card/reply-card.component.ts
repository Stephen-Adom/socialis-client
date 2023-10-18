/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyType, SimpleUserInfoType } from 'utils';
import { format } from 'date-fns';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';

@Component({
  selector: 'lib-reply-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './reply-card.component.html',
  styleUrls: ['./reply-card.component.scss'],
})
export class ReplyCardComponent {
  @Input({ required: true }) reply!: ReplyType;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
  }
}
