/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { CommentType, PostType, ReplyType } from 'utils';
import {
  PostApiActions,
  PostState,
  getAllBookmarks,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { PostCardComponent } from 'post-card';
import { CommentCardComponent } from 'comment-list';
import { ReplyCardComponent } from 'comment-reply-modal';

@Component({
  selector: 'lib-bookmarks',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    CommentCardComponent,
    ReplyCardComponent,
  ],
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
})
export class BookmarksComponent implements OnInit, OnDestroy {
  allBookmarks$!: Observable<any>;
  userSubscription = new Subscription();

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.userSubscription = this.store
      .select(getUserInformation)
      .subscribe((user) => {
        if (user) {
          this.store.dispatch(
            PostApiActions.fetchAllUserBookmarks({ userId: user.id })
          );
        }
      });

    this.allBookmarks$ = this.store.select(getAllBookmarks);

    this.allBookmarks$.subscribe((data) => {
      console.log(data, 'bookmarks');
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getPostUidTag(uid: string) {
    console.log(uid.includes('post'));
    console.log(uid);
    return uid.includes('post');
  }

  getCommentUidTag(uid: string) {
    return uid.includes('cmt');
  }

  getReplyUidTag(uid: string) {
    return uid.includes('rpl');
  }
}
