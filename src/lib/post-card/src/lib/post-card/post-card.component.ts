/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LikeType,
  PostType,
  SUCCESS_MESSAGE_TOKEN,
  SimpleUserInfoType,
  UserInfoType,
  generateLikeDescription,
} from 'utils';
import { formatDistanceToNow } from 'date-fns';
import {
  AppApiActions,
  PostApiActions,
  PostState,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { OnDestroy } from '@angular/core';
import {
  ConfirmDeleteService,
  PostService,
  SuccessMessageService,
  dataDeleteObject,
} from 'services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-post-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnChanges, OnInit, OnDestroy {
  @Input({ required: true }) post!: PostType;
  authUser$!: Observable<UserInfoType | null>;
  authUserSubscription = new Subscription();

  formattedDate: string | null = null;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  likedPost$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private store: Store<PostState>,
    private router: Router,
    private postservice: PostService,
    private confirmDeleteService: ConfirmDeleteService
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.checkIfLiked();
  }

  viewPostDetails(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.tagName !== 'A' &&
      target.tagName !== 'IMG' &&
      target.tagName !== 'BUTTON' &&
      target.tagName !== 'svg'
    ) {
      this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
      this.router.navigate([this.post.user.username, 'details', this.post.id]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });
    }
  }

  checkIfLiked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const likedPost = this.post.likes.find(
          (like) => like.username === authUser.username
        );

        likedPost ? this.likedPost$.next(true) : this.likedPost$.next(false);
      } else {
        this.likedPost$.next(false);
      }
    });
  }

  addComment() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
  }

  viewComments() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
  }

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
  }

  toggleLike() {
    combineLatest([this.authUser$, this.likedPost$]).subscribe(
      ([authuser, likedPost]) => {
        if (authuser) {
          this.store.dispatch(
            PostApiActions.togglePostLike({
              post: this.post,
              authuser,
              isLiked: likedPost,
            })
          );
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
  }

  generateLikeDescription(likes: LikeType[], authUser: UserInfoType | null) {
    return generateLikeDescription(likes, authUser);
  }

  isAuth(author: string, authUser: UserInfoType | null) {
    return author === authUser?.username;
  }

  editPost(post: PostType) {
    this.store.dispatch(PostApiActions.editPost({ post }));
  }

  deletePost(post: PostType) {
    const data: dataDeleteObject = {
      data: post,
      type: 'post',
    };
    this.confirmDeleteService.deletePost(data);
    // this.store.dispatch(PostApiActions.deletePost({ postId: post.id }));
    // this.postservice.deletePost(post.id).subscribe({
    //   next: (response: any) => {
    //     this.successMessage.sendSuccessMessage(response.message);
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.store.dispatch(
    //       AppApiActions.displayErrorMessage({ error: error.error })
    //     );
    //   },
    // });
  }
}
