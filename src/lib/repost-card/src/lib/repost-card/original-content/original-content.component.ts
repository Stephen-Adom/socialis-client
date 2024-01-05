/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PostType,
  SimpleUserInfoType,
  UserInfoType,
  UserSummaryInfo,
  UserSummaryInfoFollowing,
} from 'utils';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormatPostService, UserService } from 'services';
import {
  AppApiActions,
  PostState,
  UserApiActions,
  getAllAuthUserFollowers,
  getAllAuthUserFollowing,
  getUserInformation,
} from 'state';
import { formatDistanceToNow } from 'date-fns';
import { MediaInfoComponent } from 'media-info';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-original-content',
  standalone: true,
  imports: [CommonModule, MediaInfoComponent],
  templateUrl: './original-content.component.html',
  styleUrls: ['./original-content.component.css'],
})
export class OriginalContentComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input({ required: true }) post!: PostType;
  @ViewChild('followingButtonLabel')
  followingButtonLabel!: ElementRef<HTMLButtonElement>;
  authUser$!: Observable<UserInfoType | null>;
  authorDetailSubscription: Subscription | undefined;
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  authFollowers$!: Observable<UserSummaryInfo[]>;
  formattedDate!: string;
  formattedText: string | null = null;
  showFollowButton = false;
  authUserSubscription: Subscription | undefined;
  followingAuthor$ = new BehaviorSubject<boolean>(false);
  authFollowing$!: Observable<UserSummaryInfo[]>;
  followButtonText = 'Follow';
  authUser!: UserInfoType;
  unfollowUserSubscription: Subscription | undefined;
  followUserSubscription: Subscription | undefined;

  constructor(
    private formatPost: FormatPostService,
    private userservice: UserService,
    private cdr: ChangeDetectorRef,
    private store: Store<PostState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);
    this.authFollowing$ = this.store.select(getAllAuthUserFollowing);

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .pipe(filter((userInfo) => userInfo !== null))
      .subscribe({
        next: (info) => {
          if (info?.username !== this.post.user.username) {
            this.authUser = info!;
            this.showFollowButton = true;
            return;
          }
          this.showFollowButton = false;
        },
        complete: () => {
          this.authUserSubscription?.unsubscribe();
        },
      });
    this.checkIfFollowingAuthor();
  }

  ngAfterViewInit(): void {
    this.formatPostContent(this.post.content);
    if (this.followingButtonLabel) {
      fromEvent(this.followingButtonLabel?.nativeElement, 'mouseenter')
        .pipe(map((event) => event.target as HTMLElement))
        .subscribe((element) => {
          if (element) {
            element.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" 
          stroke-width="1.5" 
          stroke="currentColor" 
          class="w-4 h-4 dark:stroke-red-700">
          <path stroke-linecap="round" 
          stroke-linejoin="round" 
          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>

          Unfollow
          `;
          }
        });

      fromEvent(this.followingButtonLabel?.nativeElement, 'mouseleave')
        .pipe(map((event) => event.target as HTMLElement))
        .subscribe((element) => {
          if (element) {
            element.innerHTML = `<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 dark:stroke-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>

        Following`;
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });
    }
  }

  formatPostContent(content: string) {
    this.formattedText = this.formatPost.formatPostContent(content);
    this.cdr.detectChanges();
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

  checkIfFollowingAuthor() {
    this.authFollowing$.subscribe((followings) => {
      const userExist = followings.find(
        (following) => following.username === this.post.user.username
      );
      userExist
        ? this.followingAuthor$.next(true)
        : this.followingAuthor$.next(false);
    });
  }

  unfollowUser() {
    this.store.dispatch(
      UserApiActions.removeAFollowing({ userId: this.post.user.id })
    );

    this.unfollowUserSubscription = this.userservice
      .unfollowUser(this.authUser.id, this.post.user.id)
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
        complete: () => {
          this.unfollowUserSubscription?.unsubscribe();
        },
      });
  }

  followUser() {
    this.updateFollowingInStore();

    this.followUserSubscription = this.userservice
      .followUser(this.authUser.id, this.post.user.id)
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
        complete: () => {
          this.followUserSubscription?.unsubscribe();
        },
      });
  }

  updateFollowingInStore() {
    const user: UserSummaryInfoFollowing = {
      id: this.post.user.id,
      firstname: this.post.user.firstname,
      lastname: this.post.user.lastname,
      username: this.post.user.username,
      bio: '',
      imageUrl: '',
      coverImageUrl: '',
      phonenumber: '',
      address: '',
      totalPost: 0,
      createdAt: '',
      followers: 0,
      following: 0,
      followersList: [],
      followingList: [],
    };

    this.store.dispatch(UserApiActions.followUser({ user }));
  }
}
