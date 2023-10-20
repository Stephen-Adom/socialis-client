/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LikeType,
  PostType,
  SimpleUserInfoType,
  UserInfoType,
  generateLikeDescription,
} from 'utils';
import { formatDistanceToNow } from 'date-fns';
import { PostApiActions, PostState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { OnDestroy } from '@angular/core';

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

  constructor(private store: Store<PostState>, private router: Router) {}

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
}
