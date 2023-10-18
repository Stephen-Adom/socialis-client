/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType, SimpleUserInfoType } from 'utils';
import { format } from 'date-fns';
import { PostApiActions, PostState } from 'state';
import { Store } from '@ngrx/store';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';

@Component({
  selector: 'lib-comment-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent {
  @Input({ required: true }) comment!: CommentType;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  constructor(private store: Store<PostState>) {}

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }

  setCommentActive(comment: CommentType) {
    this.store.dispatch(PostApiActions.getCommentDetails({ comment }));
  }

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
  }
}
