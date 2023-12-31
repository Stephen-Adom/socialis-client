/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommentType,
  LikeType,
  PostType,
  SimpleUserInfoType,
  UserInfoType,
  UserSummaryInfo,
  generateLikeDescription,
} from 'utils';
import { format } from 'date-fns';
import {
  PostApiActions,
  PostState,
  getAllAuthUserFollowers,
  getPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import lgZoom from 'lightgallery/plugins/zoom';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { ConfirmDeleteService, dataDeleteObject } from 'services';
import { Router } from '@angular/router';
import { ProfileTooltipDirective } from 'directives';
import { MediaInfoComponent } from 'media-info';

@Component({
  selector: 'lib-comment-card',
  standalone: true,
  imports: [CommonModule, MediaInfoComponent, ProfileTooltipDirective],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit, OnDestroy {
  @Input({ required: false }) pageClass!: string;
  @Input({ required: true }) comment!: CommentType;

  likedComment$ = new BehaviorSubject<boolean>(false);

  authUser$!: Observable<UserInfoType | null>;
  post!: PostType;
  postSubscription = new Subscription();
  bookmarked$ = new BehaviorSubject<boolean>(false);
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  authFollowers$!: Observable<UserSummaryInfo[]>;

  constructor(
    private confirmDeleteService: ConfirmDeleteService,
    private store: Store<PostState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);
    this.postSubscription = this.store
      .select(getPostDetails)
      .subscribe((post) => {
        if (post) {
          this.post = post;
        }
      });
    this.checkIfLiked();
    this.checkIfBookmarked();
    this.checkIfAuthorIsFollowing();
  }

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }

  setCommentActive(comment: CommentType) {
    this.store.dispatch(PostApiActions.getCommentDetails({ comment }));
  }

  toggleLike() {
    combineLatest([this.authUser$, this.likedComment$]).subscribe(
      ([authuser, likedComment]) => {
        if (authuser) {
          this.store.dispatch(
            PostApiActions.toggleCommentLike({
              comment: this.comment,
              authuser,
              isLiked: likedComment,
            })
          );
        }
      }
    );
  }

  checkIfBookmarked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const bookmarked = this.comment.bookmarkedUsers.includes(authUser.id);

        bookmarked ? this.bookmarked$.next(true) : this.bookmarked$.next(false);

        return;
      }
      this.bookmarked$.next(false);
    });
  }

  checkIfAuthorIsFollowing() {
    this.authFollowers$.subscribe((followers) => {
      const userExist = followers.find(
        (follower) => follower.username === this.comment.user.username
      );
      userExist
        ? this.authorIsFollowing$.next(true)
        : this.authorIsFollowing$.next(false);
    });
  }

  checkIfLiked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const likedComment = this.comment.likes.find(
          (like) => like.username === authUser.username
        );

        likedComment
          ? this.likedComment$.next(true)
          : this.likedComment$.next(false);
      } else {
        this.likedComment$.next(false);
      }
    });
  }

  generateLikeDescription(likes: LikeType[], authUser: UserInfoType | null) {
    return generateLikeDescription(likes, authUser);
  }

  isAuth(author: string, authUser: UserInfoType | null) {
    return author === authUser?.username;
  }

  editComment(comment: CommentType) {
    this.store.dispatch(PostApiActions.editComment({ comment }));
  }

  deleteComment(comment: CommentType) {
    const data: dataDeleteObject = {
      data: comment.id,
      type: 'comment',
    };
    this.confirmDeleteService.deletePost(data);
  }

  viewCommentDetails(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.tagName !== 'A' &&
      target.tagName !== 'IMG' &&
      target.tagName !== 'BUTTON' &&
      target.tagName !== 'svg'
    ) {
      // this.store.dispatch(
      //   PostApiActions.getCommentDetails({ comment: this.comment })
      // );
      // this.router.navigate([
      //   this.post.user.username,
      //   'details',
      //   this.post.uid,
      //   this.comment.user.username,
      //   'details',
      //   this.comment.uid,
      // ]);
    }
  }

  viewDetails() {
    this.store.dispatch(
      PostApiActions.getCommentDetails({ comment: this.comment })
    );
    this.router.navigate([
      this.post.user.username,
      'details',
      this.post.uid,
      this.comment.user.username,
      'details',
      this.comment.uid,
    ]);
  }

  toggleBookmark() {
    this.authUser$.subscribe((user) => {
      if (user) {
        this.store.dispatch(
          PostApiActions.toggleBookmarkComment({
            comment: this.comment,
            userId: user.id,
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
