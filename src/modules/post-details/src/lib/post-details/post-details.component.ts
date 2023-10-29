/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommentListComponent } from 'comment-list';
import { CreateCommentFormComponent } from 'create-comment-form';
import { ActivatedRoute } from '@angular/router';
import {
  PostApiActions,
  PostState,
  getPostDetails,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { PostType, SimpleUserInfoType, UserInfoType } from 'utils';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  tap,
} from 'rxjs';
import { format } from 'date-fns';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { ConfirmDeleteService, dataDeleteObject } from 'services';

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
  postId!: number;
  postSubscription = new Subscription();
  routeSubscription = new Subscription();
  authUserSubscription = new Subscription();
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  likedPost$ = new BehaviorSubject<boolean>(false);
  authUser!: UserInfoType;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<PostState>,
    private confirmDeleteService: ConfirmDeleteService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((data) => {
      this.postId = parseInt(data.get('id')!);
    });

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
          this.checkIfLiked(this.post, this.authUser);
        }
      });

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((authUser) => {
        if (authUser) {
          this.authUser = authUser;
          this.checkIfLiked(this.post, this.authUser);
        }
      });
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
}
