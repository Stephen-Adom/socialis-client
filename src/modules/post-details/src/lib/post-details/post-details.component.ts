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
  authUser$!: Observable<UserInfoType | null>;
  showAnimation$ = new BehaviorSubject<boolean>(false);

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((data) => {
      this.postId = parseInt(data.get('id')!);
    });

    this.postSubscription = this.store
      .select(getPostDetails)
      .pipe(
        tap((post) => {
          if (post) {
            this.post = post;
          } else {
            this.store.dispatch(
              PostApiActions.fetchPostById({ postId: this.postId })
            );
          }
        })
      )
      .subscribe();

    this.authUser$ = this.store.select(getUserInformation);

    this.showAnimation$
      .pipe(
        tap((animation) => {
          if (animation) {
            setTimeout(() => {
              this.showAnimation$.next(false);
            }, 400);
          }
        })
      )
      .subscribe();

    this.checkIfLiked();
  }

  checkIfLiked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser && this.post) {
        const likedPost = this.post.likes.find(
          (like) => like.username === authUser.username
        );
        likedPost ? this.likedPost$.next(true) : this.likedPost$.next(false);
      } else {
        this.likedPost$.next(false);
      }
    });
  }

  toggleLike() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.store.dispatch(
          PostApiActions.togglePostLike({
            post: this.post,
            authuser: authUser,
            isLiked: this.likedPost$.value,
          })
        );

        this.showAnimation$.next(true);
      }
    });
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
}
