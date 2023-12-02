/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import {
  ConfirmDeleteService,
  FormatPostService,
  dataDeleteObject,
} from 'services';
import {
  PostState,
  PostApiActions,
  getUserInformation,
  getCommentDetails,
  getAllReplies,
  getAllAuthUserFollowers,
  getPostDetails,
} from 'state';
import {
  CommentType,
  PostType,
  ReplyType,
  SimpleUserInfoType,
  UserInfoType,
  UserSummaryInfo,
} from 'utils';
import { format } from 'date-fns';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { ReplyCardComponent } from 'comment-reply-modal';
import { CreateReplyFormComponent } from '../create-reply-form/create-reply-form.component';

@Component({
  selector: 'lib-comment-details',
  standalone: true,
  imports: [
    CommonModule,
    LightgalleryModule,
    ReplyCardComponent,
    CreateReplyFormComponent,
  ],
  templateUrl: './comment-details.component.html',
  styleUrls: ['./comment-details.component.css'],
})
export class CommentDetailsComponent implements OnInit, OnDestroy {
  likedComment$ = new BehaviorSubject<boolean>(false);
  bookmarked$ = new BehaviorSubject<boolean>(false);
  routeSubscription = new Subscription();
  commentSubscription = new Subscription();
  authUserSubscription = new Subscription();
  allReplies$!: Observable<ReplyType[]>;
  commentId!: string;
  postId!: string;
  comment!: CommentType;
  authUser!: UserInfoType;
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  formattedText: string | null = null;
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  authFollowers$!: Observable<UserSummaryInfo[]>;
  postDetails$!: Observable<PostType | null>;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private store: Store<PostState>,
    private formatPost: FormatPostService,
    private confirmDeleteService: ConfirmDeleteService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((data) => {
      this.commentId = data.get('commentId') as string;
      this.postId = data.get('postId') as string;

      this.store.dispatch(
        PostApiActions.fetchCommentById({ commentId: this.commentId })
      );
      this.store.dispatch(
        PostApiActions.fetchPostById({ postId: this.postId })
      );
    });

    this.postDetails$ = this.store.select(getPostDetails);

    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);

    this.commentSubscription = this.store
      .select(getCommentDetails)
      .subscribe((comment) => {
        if (comment) {
          this.comment = comment;
          this.formatPostContent(this.comment.content);
          this.checkIfLiked(this.comment, this.authUser);
          this.checkIfBookmarked(this.authUser, this.comment);
          this.checkIfAuthorIsFollowing();
        }
      });

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((authUser) => {
        if (authUser) {
          this.authUser = authUser;
          this.checkIfLiked(this.comment, this.authUser);
          this.checkIfBookmarked(this.authUser, this.comment);
        }
      });

    this.allReplies$ = this.store.select(getAllReplies);
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

  formatPostContent(content: string) {
    this.formattedText = this.formatPost.formatPostContent(content);
    this.cdr.detectChanges();
  }

  checkIfBookmarked(authUser: UserInfoType, comment: CommentType) {
    if (authUser) {
      const bookmarked = comment.bookmarkedUsers.includes(authUser.id);

      bookmarked ? this.bookmarked$.next(true) : this.bookmarked$.next(false);
    }
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

  toggleBookmark() {
    if (this.authUser) {
      this.store.dispatch(
        PostApiActions.toggleBookmarkComment({
          comment: this.comment,
          userId: this.authUser.id,
        })
      );
    }
  }

  viewAuthorDetails(author: SimpleUserInfoType) {
    if (this.authUser.username === author.username) {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['user', author.username, 'profile']);
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(PostApiActions.clearCommentDetails());
    this.store.dispatch(PostApiActions.clearReplyDetails());
  }
}
