/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostType, SimpleUserInfoType } from 'utils';
import { formatDistanceToNow } from 'date-fns';
import { PostApiActions, PostState } from 'state';
import { Store } from '@ngrx/store';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';

@Component({
  selector: 'lib-post-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnChanges {
  @Input({ required: true }) post!: PostType;

  formattedDate: string | null = null;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  constructor(private store: Store<PostState>, private router: Router) {}

  viewPostDetails() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
    this.router.navigate([this.post.user.username, 'details', this.post.id]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });
    }
  }

  addComment() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
  }

  viewComments() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
  }

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
  }
}
