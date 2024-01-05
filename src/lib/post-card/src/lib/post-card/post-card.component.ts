/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SecurityContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LikeType,
  PostType,
  SimpleUserInfoType,
  StoryType,
  UserInfoType,
  UserSummaryInfo,
  generateLikeDescription,
} from 'utils';
import { formatDistanceToNow } from 'date-fns';
import {
  PostApiActions,
  PostState,
  getAllAuthUserFollowers,
  getAllFollowingStories,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { OnDestroy } from '@angular/core';
import {
  ConfirmDeleteService,
  FormatPostService,
  dataDeleteObject,
} from 'services';
import { ProfileTooltipDirective } from 'directives';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaInfoComponent } from 'media-info';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'lib-post-card',
  standalone: true,
  imports: [
    CommonModule,
    MediaInfoComponent,
    ProfileTooltipDirective,
    OverlayPanelModule,
  ],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit
{
  @Input({ required: false }) pageClass!: string;
  @Input({ required: true }) post!: PostType;
  @ViewChild('repostOverlay') repostOverlay!: OverlayPanel;
  authUser$!: Observable<UserInfoType | null>;
  authFollowers$!: Observable<UserSummaryInfo[]>;
  authUserSubscription = new Subscription();
  authorDetailSubscription: Subscription | undefined;

  formattedDate: string | null = null;

  likedPost$ = new BehaviorSubject<boolean>(false);
  bookmarked$ = new BehaviorSubject<boolean>(false);
  authorInfo!: UserSummaryInfo;
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  formattedText: string | null = null;
  hasStory$ = new BehaviorSubject<boolean>(false);
  stories$!: Observable<StoryType[]>;

  constructor(
    private confirmDeleteService: ConfirmDeleteService,
    private formatPost: FormatPostService,
    private cdr: ChangeDetectorRef,
    private store: Store<PostState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);
    this.stories$ = this.store.select(getAllFollowingStories);
    this.checkIfLiked();
    this.checkIfBookmarked();
    this.checkIfAuthorIsFollowing();
    this.checkIfAuthorHasStory();
  }

  ngAfterViewInit(): void {
    this.formatPostContent(this.post.content);
  }

  viewPostDetails(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.tagName !== 'A' &&
      target.tagName !== 'IMG' &&
      target.tagName !== 'BUTTON' &&
      target.tagName !== 'svg'
    ) {
      // this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
      // this.router.navigate([this.post.user.username, 'details', this.post.uid]);
    }
  }

  viewDetails() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
    this.router.navigate([this.post.user.username, 'details', this.post.uid]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });
    }
  }

  checkIfBookmarked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const bookmarked = this.post.bookmarkedUsers.includes(authUser.id);

        bookmarked ? this.bookmarked$.next(true) : this.bookmarked$.next(false);

        return;
      }
      this.bookmarked$.next(false);
    });
  }

  checkIfLiked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const likedPost = this.post.likes.find(
          (like) => like.username === authUser.username
        );

        likedPost ? this.likedPost$.next(true) : this.likedPost$.next(false);
        return;
      }
      this.likedPost$.next(false);
    });
  }

  addComment() {
    this.store.dispatch(PostApiActions.getPostDetails({ post: this.post }));
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

  getGenerateLikeDescription(likes: LikeType[], authUser: UserInfoType | null) {
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
      data: post.id,
      type: 'post',
    };
    this.confirmDeleteService.deletePost(data);
  }

  toggleBookmark() {
    this.authUser$.subscribe((user) => {
      if (user) {
        this.store.dispatch(
          PostApiActions.toggleBookmarkPost({
            post: this.post,
            userId: user.id,
          })
        );
      }
    });
  }

  viewAuthorDetails(user: SimpleUserInfoType) {
    this.authorDetailSubscription = this.authUser$.subscribe((authUser) => {
      if (authUser?.username === user.username) {
        this.router.navigate(['profile']);
      } else {
        this.router.navigate(['user', user.username, 'profile']);
      }

      this.authorDetailSubscription?.unsubscribe();
    });
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

  formatPostContent(content: string) {
    this.formattedText = this.formatPost.formatPostContent(content);
    this.cdr.detectChanges();
  }

  checkIfAuthorHasStory() {
    this.stories$.subscribe((stories) => {
      if (stories.length) {
        const storyExist = stories.find(
          (story) => story.user.username === this.post.user.username
        );

        this.hasStory$.next(storyExist ? true : false);
      }
    });
  }

  repostWithNoContent(event: Event) {
    let authUser: UserInfoType | null = null;
    this.authUser$.subscribe((data) => (authUser = data));

    if (authUser) {
      this.store.dispatch(
        PostApiActions.repostWithNoContent({
          userId: authUser['id'] as number,
          postId: this.post.id,
        })
      );

      this.repostOverlay.toggle(event);
    }
  }

  checkIfReshared(authUser: UserInfoType | null) {
    return this.post.resharedBy.find(
      (reshared) => reshared.userId === authUser?.id
    );
  }
}
