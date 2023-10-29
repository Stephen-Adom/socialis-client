/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { ConfirmDeleteService, dataDeleteObject } from 'services';
import {
  PostState,
  PostApiActions,
  getUserInformation,
  getCommentDetails,
  getAllReplies,
} from 'state';
import {
  CommentType,
  ReplyType,
  SimpleUserInfoType,
  UserInfoType,
} from 'utils';
import { format } from 'date-fns';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { ReplyCardComponent } from 'comment-reply-modal';

@Component({
  selector: 'lib-comment-details',
  standalone: true,
  imports: [CommonModule, LightgalleryModule, ReplyCardComponent],
  templateUrl: './comment-details.component.html',
  styleUrls: ['./comment-details.component.css'],
})
export class CommentDetailsComponent implements OnInit {
  likedComment$ = new BehaviorSubject<boolean>(false);
  routeSubscription = new Subscription();
  commentSubscription = new Subscription();
  authUserSubscription = new Subscription();
  allReplies$!: Observable<ReplyType[]>;
  commentId!: number;
  postId!: number;
  comment!: CommentType;
  authUser!: UserInfoType;
  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<PostState>,
    private confirmDeleteService: ConfirmDeleteService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((data) => {
      this.commentId = parseInt(data.get('commentId')!);
      this.postId = parseInt(data.get('postId')!);
    });

    this.commentSubscription = this.store
      .select(getCommentDetails)
      .pipe(
        tap((comment) => {
          if (!comment) {
            this.store.dispatch(
              PostApiActions.fetchCommentById({ commentId: this.commentId })
            );
            this.store.dispatch(
              PostApiActions.fetchPostById({ postId: this.postId })
            );
          }
        })
      )
      .subscribe((comment) => {
        if (comment) {
          this.comment = comment;
          this.checkIfLiked(this.comment, this.authUser);
        }
      });

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((authUser) => {
        if (authUser) {
          this.authUser = authUser;
          this.checkIfLiked(this.comment, this.authUser);
        }
      });

    this.allReplies$ = this.store.select(getAllReplies);
  }

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }

  back() {
    this.location.back();
  }

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
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

  toggleLike() {
    if (this.authUser && this.comment) {
      this.store.dispatch(
        PostApiActions.toggleCommentLike({
          comment: this.comment,
          authuser: this.authUser,
          isLiked: this.likedComment$.value,
        })
      );
    }
  }

  generateLikeDescription(
    likes: { username: string; imageUrl: string }[],
    authUser: UserInfoType | null
  ) {
    if (likes.length && likes.length == 1) {
      return `Liked by ${
        likes[0].username === authUser?.username ? 'You' : likes[0].username
      }`;
    } else if (likes.length === 2) {
      return `Liked by ${
        likes[0].username === authUser?.username ? 'You' : likes[0].username
      }  and ${likes[1].username}`;
    } else {
      return `Liked by ${
        likes[0].username === authUser?.username ? 'You' : likes[0].username
      } and ${likes.length - 1} others`;
    }
  }

  checkIfLiked(comment: CommentType, authUser: UserInfoType) {
    if (authUser && comment) {
      const likedPost = comment.likes.find(
        (like) => like.username === authUser.username
      );
      likedPost
        ? this.likedComment$.next(true)
        : this.likedComment$.next(false);
    }
  }
}