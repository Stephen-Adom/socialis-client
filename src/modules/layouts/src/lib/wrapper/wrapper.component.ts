import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as localforage from 'localforage';
import { Subscription, tap } from 'rxjs';
import { MessageService, PostService } from 'services';
import {
  AppApiActions,
  PostApiActions,
  PostState,
  getCommentDetails,
  getPostDetails,
} from 'state';

@Component({
  selector: 'feature-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit, OnDestroy {
  userInfoSubscription = new Subscription();
  postDetailsSubscription = new Subscription();
  newPostSubscription = new Subscription();
  newCommentSubscription = new Subscription();
  postUpdateSubscription = new Subscription();
  commentUpdateSubscription = new Subscription();
  newReplySubscription = new Subscription();
  replyUpdateSubscription = new Subscription();
  userUpdateSubscription = new Subscription();
  commentDetailsSubscription = new Subscription();
  bookmarkUpdateSubscription = new Subscription();

  constructor(
    private postservice: PostService,
    private messageservice: MessageService,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(PostApiActions.fetchAllPost());

    const postDetailsSub = (this.postDetailsSubscription = this.store
      .select(getPostDetails)
      .subscribe((post) => {
        if (post) {
          this.store.dispatch(
            PostApiActions.fetchPostComments({ postId: post.id })
          );

          postDetailsSub.unsubscribe();
        }
      }));

    const sub = (this.commentDetailsSubscription = this.store
      .select(getCommentDetails)
      .subscribe((comment) => {
        if (comment) {
          this.store.dispatch(
            PostApiActions.fetchReplies({ commentId: comment.id })
          );
          sub.unsubscribe();
        }
      }));

    this.newPostSubscription = this.messageservice
      .onMessage('/feed/post/new')
      .subscribe({
        next: (newPost) => {
          if (newPost) {
            this.store.dispatch(PostApiActions.addNewPost({ newPost }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.newCommentSubscription = this.messageservice
      .onMessage('/feed/comment/new')
      .subscribe({
        next: (newComment) => {
          if (newComment) {
            this.store.dispatch(PostApiActions.addNewComment({ newComment }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.postUpdateSubscription = this.messageservice
      .onMessage('/feed/post/update')
      .subscribe({
        next: (post) => {
          if (post) {
            console.log(post);
            this.store.dispatch(PostApiActions.updateAPost({ post }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.commentUpdateSubscription = this.messageservice
      .onMessage('/feed/comment/update')
      .subscribe({
        next: (comment) => {
          if (comment) {
            this.store.dispatch(PostApiActions.updateAComment({ comment }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.newReplySubscription = this.messageservice
      .onMessage('/feed/reply/new')
      .subscribe({
        next: (newReply) => {
          if (newReply) {
            this.store.dispatch(PostApiActions.addNewReply({ newReply }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.replyUpdateSubscription = this.messageservice
      .onMessage('/feed/reply/update')
      .subscribe({
        next: (reply) => {
          if (reply) {
            this.store.dispatch(PostApiActions.updateReply({ reply }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.userUpdateSubscription = this.messageservice
      .onMessage('/feed/user/update')
      .subscribe({
        next: (user) => {
          if (user) {
            localforage.setItem('userInfo', user).then((userInfo) => {
              this.store.dispatch(AppApiActions.updateUserInfo({ userInfo }));
            });
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.bookmarkUpdateSubscription = this.messageservice
      .onMessage('/feed/bookmarks/update')
      .subscribe({
        next: (bookmarks) => {
          if (bookmarks) {
            console.log(bookmarks);
            this.store.dispatch(
              PostApiActions.updateUserBookmarks({ bookmarks })
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    // this.postservice.fetchAllPost().subscribe((posts) => {
    //   console.log(posts);
    // });
  }
  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
    this.postDetailsSubscription.unsubscribe();
    this.newPostSubscription.unsubscribe();
    this.newCommentSubscription.unsubscribe();
    this.postUpdateSubscription.unsubscribe();
    this.commentUpdateSubscription.unsubscribe();
    this.newReplySubscription.unsubscribe();
    this.replyUpdateSubscription.unsubscribe();
    this.userUpdateSubscription.unsubscribe();
    this.commentDetailsSubscription.unsubscribe();
    this.bookmarkUpdateSubscription.unsubscribe();
  }
}
