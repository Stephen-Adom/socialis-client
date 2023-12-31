/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as localforage from 'localforage';
import {
  Subscription,
  tap,
  Observable,
  switchMap,
  map,
  distinctUntilChanged,
  of,
  retry,
  interval,
} from 'rxjs';
import {
  DisplayAlertInfoService,
  MessageService,
  NoInternetService,
} from 'services';
import {
  AppApiActions,
  PostApiActions,
  PostState,
  StoryApiActions,
  UserApiActions,
  getAllAuthUserFollowing,
  getCommentDetails,
  getPostDetails,
  getUserInformation,
} from 'state';
import { UserInfoType, UserSummaryInfo, isConnected } from 'utils';

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

  authUser$!: Observable<UserInfoType | null>;
  userFollowing$!: Observable<UserSummaryInfo[]>;
  connectivitySubscription = new Subscription();

  constructor(
    private alertInfoService: DisplayAlertInfoService,
    private noInternetService: NoInternetService,
    private messageservice: MessageService,
    private store: Store<PostState>
  ) {
    window.addEventListener('online', () =>
      this.noInternetService.toggleIsNotConnected(false)
    );
    window.addEventListener('offline', () =>
      this.noInternetService.toggleIsNotConnected(true)
    );

    of(isConnected()).subscribe((status) => {
      this.noInternetService.toggleIsNotConnected(!status);
    });
  }

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);

    this.userFollowing$ = this.store.select(getAllAuthUserFollowing);

    this.authUser$
      .pipe(
        map((user) => user?.username),
        distinctUntilChanged(),
        tap((username) => {
          if (username) {
            this.store.dispatch(UserApiActions.fetchAllFollowers({ username }));
            this.store.dispatch(UserApiActions.fetchAllFollowing({ username }));
          }
        })
      )
      .subscribe();

    this.postDetailsSubscription = this.store
      .select(getPostDetails)
      .subscribe((post) => {
        if (post) {
          this.store.dispatch(
            PostApiActions.fetchPostComments({ postId: post.id })
          );
        }
      });

    this.commentDetailsSubscription = this.store
      .select(getCommentDetails)
      .subscribe((comment) => {
        if (comment) {
          this.store.dispatch(
            PostApiActions.fetchReplies({ commentId: comment.id })
          );
        }
      });

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

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage('/feed/user/update-' + username);
        })
      )
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

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/followers/count-' + username
          );
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.store.dispatch(UserApiActions.updateFollowersList({ user }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/following/count-' + username
          );
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.store.dispatch(UserApiActions.updateFollowingList({ user }));
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/following/count/remove-' + username
          );
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.store.dispatch(
              UserApiActions.removeAFollowing({ userId: user.id })
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/followers/count/remove-' + username
          );
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.store.dispatch(
              UserApiActions.removeAFollower({ userId: user.id })
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/activities/new-' + username
          );
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            console.log(user, 'new activity');
            // this.store.dispatch(
            //   UserApiActions.removeAFollower({ userId: user.id })
            // );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/notification/user-' + username
          );
        })
      )
      .subscribe({
        next: (notification) => {
          if (notification) {
            console.log(notification, 'notification');
            this.alertInfoService.sendAlertInfo(notification);
            this.store.dispatch(
              UserApiActions.newNotification({ notification })
            );
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage(
            '/feed/notification/count/user-' + username
          );
        })
      )
      .subscribe({
        next: (count) => {
          this.store.dispatch(
            UserApiActions.updateUnreadNotificationCount({ unreadCount: count })
          );
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.authUser$
      .pipe(
        map((user) => user?.username),
        switchMap((username) => {
          return this.messageservice.onMessage('/feed/user/story/' + username);
        })
      )
      .subscribe({
        next: (story) => {
          console.log('feed user story');
          this.store.dispatch(StoryApiActions.updateAuthUserStory({ story }));
        },
        error: (error) => {
          console.log(error);
        },
      });
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
    this.connectivitySubscription.unsubscribe();
  }
}
