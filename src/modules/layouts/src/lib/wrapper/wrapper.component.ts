import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, first, map, tap } from 'rxjs';
import { MessageService, PostService } from 'services';
import {
  PostApiActions,
  PostState,
  getPostDetails,
  getUserInformation,
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

  constructor(
    private postservice: PostService,
    private messageservice: MessageService,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    // this.store.dispatch(PostApiActions.fetchAllPost());

    this.postDetailsSubscription = this.store
      .select(getPostDetails)
      .pipe(
        tap((post) => {
          if (post) {
            this.store.dispatch(
              PostApiActions.fetchPostComments({ postId: post.id })
            );
          }
        })
      )
      .subscribe();

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
            console.log(reply, 'reply');
            this.store.dispatch(PostApiActions.updateReply({ reply }));
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
  }
}
