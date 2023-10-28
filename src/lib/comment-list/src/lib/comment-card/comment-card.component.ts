/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommentType,
  LikeType,
  SUCCESS_MESSAGE_TOKEN,
  SimpleUserInfoType,
  UserInfoType,
  generateLikeDescription,
} from 'utils';
import { format } from 'date-fns';
import {
  AppApiActions,
  PostApiActions,
  PostState,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  CommentService,
  ConfirmDeleteService,
  SuccessMessageService,
  dataDeleteObject,
} from 'services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-comment-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input({ required: true }) comment!: CommentType;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  likedComment$ = new BehaviorSubject<boolean>(false);

  authUser$!: Observable<UserInfoType | null>;

  constructor(
    private confirmDeleteService: ConfirmDeleteService,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
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
}
