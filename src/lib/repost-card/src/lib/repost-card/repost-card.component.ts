/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PostApiActions,
  PostState,
  getAllAuthUserFollowers,
  getAllFollowingStories,
  getAllPosts,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import {
  LikeType,
  PostType,
  StoryType,
  UserInfoType,
  UserSummaryInfo,
  generateLikeDescription,
} from 'utils';
import { PostCardComponent } from 'post-card';
import { formatDistanceToNow } from 'date-fns';
import {
  ConfirmDeleteService,
  FormatPostService,
  dataDeleteObject,
} from 'services';
import { OriginalPostContentComponent } from './original-post-content/original-post-content.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { OriginalContentComponent } from './original-content/original-content.component';

@Component({
  selector: 'lib-repost-card',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    OriginalPostContentComponent,
    OverlayPanelModule,
    OriginalContentComponent,
  ],
  templateUrl: './repost-card.component.html',
  styleUrls: ['./repost-card.component.css'],
})
export class RepostCardComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('repostOverlay') repostOverlay!: OverlayPanel;
  @Input({ required: true }) post!: PostType;
  hasStory$ = new BehaviorSubject<boolean>(false);
  stories$!: Observable<StoryType[]>;
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  authFollowers$!: Observable<UserSummaryInfo[]>;
  formattedDate: string | null = null;
  authUser$!: Observable<UserInfoType | null>;
  formattedText: string | null = null;
  likedPost$ = new BehaviorSubject<boolean>(false);
  bookmarked$ = new BehaviorSubject<boolean>(false);

  constructor(
    private confirmDeleteService: ConfirmDeleteService,
    private formatPost: FormatPostService,
    private cdr: ChangeDetectorRef,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.stories$ = this.store.select(getAllFollowingStories);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);
    this.authUser$ = this.store.select(getUserInformation);
    this.checkIfLiked();
    this.checkIfBookmarked();
    this.checkIfAuthorIsFollowing();
    this.checkIfAuthorHasStory();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.post.content) {
      this.formatPostContent(this.post.content);
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

  formatPostContent(content: string) {
    this.formattedText = this.formatPost.formatPostContent(content);
    this.cdr.detectChanges();
  }

  toggleLike() {
    // combineLatest([this.authUser$, this.likedPost$]).subscribe(
    //   ([authuser, likedPost]) => {
    //     if (authuser) {
    //       this.store.dispatch(
    //         PostApiActions.togglePostLike({
    //           post: this.post,
    //           authuser,
    //           isLiked: likedPost,
    //         })
    //       );
    //     }
    //   }
    // );
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

  getGenerateLikeDescription(likes: LikeType[], authUser: UserInfoType | null) {
    return generateLikeDescription(likes, authUser);
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

  undoRepost(event: Event) {
    this.store.dispatch(PostApiActions.undoRepost({ repostId: this.post.id }));
    this.repostOverlay.toggle(event);
  }
}
