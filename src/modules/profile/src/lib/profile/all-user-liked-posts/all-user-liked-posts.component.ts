/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserInfoType } from 'utils';
import { PostCardComponent } from 'post-card';
import { PostApiActions, PostState, getAllPostLikesByUser } from 'state';
import { Store } from '@ngrx/store';
import { CommentCardComponent } from 'comment-list';
import { ReplyCardComponent } from 'comment-reply-modal';
import { NoPostsComponent } from 'no-posts';

@Component({
  selector: 'lib-all-user-liked-posts',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    CommentCardComponent,
    ReplyCardComponent,
    NoPostsComponent,
  ],
  templateUrl: './all-user-liked-posts.component.html',
  styleUrls: ['./all-user-liked-posts.component.scss'],
})
export class AllUserLikedPostsComponent implements OnInit, OnChanges {
  @Input({ required: true }) authUser!: UserInfoType | null;

  allPosts$!: Observable<any[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allPosts$ = this.store.select(getAllPostLikesByUser);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authUser'].currentValue) {
      this.store.dispatch(
        PostApiActions.fetchAllPostLikesByUser({
          userId: changes['authUser'].currentValue.id,
        })
      );
    }
  }

  getPostUidTag(uid: string) {
    return uid.includes('post');
  }

  getCommentUidTag(uid: string) {
    return uid.includes('cmt');
  }

  getReplyUidTag(uid: string) {
    return uid.includes('rpl');
  }
}
