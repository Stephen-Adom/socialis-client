/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType, PostType, ReplyType } from 'utils';
import { Observable, Subscription } from 'rxjs';
import {
  PostApiActions,
  PostState,
  getAllReplies,
  getCommentDetails,
  getPostDetails,
} from 'state';
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
export class CommentReplyModalComponent implements OnInit, OnDestroy {
  comment$!: Observable<CommentType | null>;
  allReplies$!: Observable<ReplyType[]>;
  commentSubscription = new Subscription();

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.comment$ = this.store.select(getCommentDetails);
    this.allReplies$ = this.store.select(getAllReplies);

    this.commentSubscription = this.comment$.subscribe((comment) => {
      if (comment) {
        this.store.dispatch(
          PostApiActions.fetchReplies({ commentId: comment.id })
        );
      }
    });
  }

  formatPostDate(post: CommentType) {
    return formatDistanceToNow(new Date(post.createdAt), {
      includeSeconds: true,
    });
  }

  ngOnDestroy(): void {
    this.commentSubscription.unsubscribe();
  }
}
