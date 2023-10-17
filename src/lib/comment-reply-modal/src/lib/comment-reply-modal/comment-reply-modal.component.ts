/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType, PostType } from 'utils';
import { Observable } from 'rxjs';
import { PostState, getCommentDetails, getPostDetails } from 'state';
import { Store } from '@ngrx/store';
import { formatDistanceToNow } from 'date-fns';
import { ReplyCardComponent } from '../reply-card/reply-card.component';

@Component({
  selector: 'lib-comment-reply-modal',
  standalone: true,
  imports: [CommonModule, ReplyCardComponent],
  templateUrl: './comment-reply-modal.component.html',
  styleUrls: ['./comment-reply-modal.component.css'],
})
export class CommentReplyModalComponent implements OnInit {
  comment$!: Observable<CommentType | null>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.comment$ = this.store.select(getCommentDetails);

    this.comment$.subscribe((comment) => {
      if (comment) {
        // this.store.dispatch()
      }
    });
  }

  formatPostDate(post: CommentType) {
    return formatDistanceToNow(new Date(post.createdAt), {
      includeSeconds: true,
    });
  }
}
