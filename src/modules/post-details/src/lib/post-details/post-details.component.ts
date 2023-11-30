/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommentListComponent } from 'comment-list';
import { CreateCommentFormComponent } from 'create-comment-form';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PostApiActions,
  PostState,
  getAllAuthUserFollowers,
  getPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import {
  PostType,
  SimpleUserInfoType,
  UserInfoType,
  UserSummaryInfo,
} from 'utils';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { format } from 'date-fns';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import {
  ConfirmDeleteService,
  FormatPostService,
  dataDeleteObject,
} from 'services';

@Component({
  selector: 'lib-post-details',
  standalone: true,
  imports: [
    CommonModule,
    CommentListComponent,
    CreateCommentFormComponent,
    LightgalleryModule,
  ],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  post!: PostType;
  postId!: string;
  postSubscription = new Subscription();
  routeSubscription = new Subscription();
  authUserSubscription = new Subscription();
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  likedPost$ = new BehaviorSubject<boolean>(false);
  bookmarked$ = new BehaviorSubject<boolean>(false);
  authUser!: UserInfoType;
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  authFollowers$!: Observable<UserSummaryInfo[]>;
  formattedText: string | null = null;

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
      this.postId = data.get('id') as string;
    });

    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);

    this.postSubscription = this.store
      .select(getPostDetails)
      .pipe(
        tap((post) => {
          if (!post) {
            this.store.dispatch(
              PostApiActions.fetchPostById({ postId: this.postId })
            );
          }
        })
      )
      .subscribe((post) => {
        if (post) {
          this.post = post;
          this.formatPostContent(this.post.content);
          this.checkIfLiked(this.post, this.authUser);
          this.checkIfBookmarked(this.authUser, this.post);
          this.checkIfAuthorIsFollowing();
        }
      });

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((authUser) => {
        if (authUser) {
          this.authUser = authUser;
          this.checkIfLiked(this.post, this.authUser);
          this.checkIfBookmarked(this.authUser, this.post);
        }
      });
  }

  formatPostContent(content: string) {
    this.formattedText = this.formatPost.formatPostContent(content);
    this.cdr.detectChanges();
  }

  checkIfAuthorIsFollowing() {
    this.authFollowers$.subscribe((followers) => {
      const userExist = followers.find(
        (follower) => follower.username === this.post.user.username
      );
      userExist
        ? this.authorIsFollowing$.next(true)
        : this.authorIsFollowing$.next(false);
    });
  }

  checkIfBookmarked(authUser: UserInfoType, post: PostType) {
    if (authUser) {
      const bookmarked = post.bookmarkedUsers.includes(authUser.id);

      bookmarked ? this.bookmarked$.next(true) : this.bookmarked$.next(false);
    }
  }

  checkIfLiked(post: PostType, authUser: UserInfoType) {
    if (authUser && post) {
      const likedPost = post.likes.find(
        (like) => like.username === authUser.username
      );
      likedPost ? this.likedPost$.next(true) : this.likedPost$.next(false);
    }
  }

  toggleLike() {
    if (this.authUser && this.post) {
      this.store.dispatch(
        PostApiActions.togglePostLike({
          post: this.post,
          authuser: this.authUser,
          isLiked: this.likedPost$.value,
        })
      );
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

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    // this.store.dispatch(PostApiActions.clearPostDetails());
    // this.store.dispatch(PostApiActions.clearAllCommentsDetails());
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

  isAuth(author: string, authUser: UserInfoType | null) {
    return author === authUser?.username;
  }

  editPost(post: PostType) {
    this.store.dispatch(PostApiActions.editPost({ post }));
  }

  deletePost(post: PostType) {
    const data: dataDeleteObject = {
      data: post.id,
      type: 'post',
    };
    this.confirmDeleteService.deletePost(data);
  }

  toggleBookmark() {
    if (this.authUser) {
      this.store.dispatch(
        PostApiActions.toggleBookmarkPost({
          post: this.post,
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
}
