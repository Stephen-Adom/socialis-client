/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostType } from 'utils';
import { formatDistanceToNow, formatDuration } from 'date-fns';
import { PostApiActions, PostState } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnChanges {
  @Input({ required: true }) post!: PostType;

  formattedDate: string | null = null;

  constructor(private store: Store<PostState>, private router: Router) {}

  viewPostDetails() {
    this.router.navigate(['/maria.wanner/details/221232323']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });

      console.log(this.formattedDate);
    }
  }

  getPostDetails() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
  }
}
