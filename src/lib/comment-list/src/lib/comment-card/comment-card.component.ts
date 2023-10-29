/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommentType,
  LikeType,
  PostType,
  SimpleUserInfoType,
  UserInfoType,
  generateLikeDescription,
} from 'utils';
import { format } from 'date-fns';
import {
  PostApiActions,
  PostState,
  getPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { ConfirmDeleteService, dataDeleteObject } from 'services';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-comment-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) comment!: CommentType;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  likedComment$ = new BehaviorSubject<boolean>(false);

  authUser$!: Observable<UserInfoType | null>;
  post!: PostType;
  postSubscription = new Subscription();

  constructor(
    private confirmDeleteService: ConfirmDeleteService,
    private store: Store<PostState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.postSubscription = this.store
      .select(getPostDetails)
      .subscribe((post) => {
        if (post) {
          this.post = post;
        }
      });
    this.checkIfLiked();
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

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
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
      this.store.dispatch(
        PostApiActions.getCommentDetails({ comment: this.comment })
      );
      this.router.navigate([
        this.post.user.username,
        'details',
        this.post.id,
        this.comment.user.username,
        'details',
        this.comment.id,
      ]);
    }
  }

  viewDetails() {
    this.store.dispatch(
      PostApiActions.getCommentDetails({ comment: this.comment })
    );
    this.router.navigate([
      this.post.user.username,
      'details',
      this.post.id,
      this.comment.user.username,
      'details',
      this.comment.id,
    ]);
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
