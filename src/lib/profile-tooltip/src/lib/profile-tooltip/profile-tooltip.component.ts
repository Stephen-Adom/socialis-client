/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoType, UserSummaryInfo, UserSummaryInfoFollowing } from 'utils';
import {
  AppApiActions,
  AppState,
  UserApiActions,
  getAllAuthUserFollowers,
  getAllAuthUserFollowing,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  filter,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { UserService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-profile-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-tooltip.component.html',
  styleUrls: ['./profile-tooltip.component.css'],
})
export class ProfileTooltipComponent implements OnInit, AfterViewInit {
  @ViewChild('followingButtonLabel')
  followingButtonLabel!: ElementRef<HTMLButtonElement>;
  @Input() authorFullInfo!: UserSummaryInfoFollowing;
  authUser!: UserInfoType;
  showFollowButton = false;
  authFollowing$!: Observable<UserSummaryInfo[]>;
  authFollowers$!: Observable<UserSummaryInfo[]>;
  followingAuthor$ = new BehaviorSubject<boolean>(false);
  followButtonText = 'Follow';
  usersFollowingAuthorAlsoFollowingAuth: UserSummaryInfo[] = [];
  authorFollowingUsersAuthAlsoFollowing: UserSummaryInfo[] = [];
  followUserSubscription: Subscription | undefined;
  unfollowUserSubscription: Subscription | undefined;

  constructor(
    private store: Store<AppState>,
    private userservice: UserService
  ) {}

  ngOnInit(): void {
    this.authFollowing$ = this.store.select(getAllAuthUserFollowing);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);

    this.store
      .select(getUserInformation)
      .pipe(filter((userInfo) => userInfo !== null))
      .subscribe((info) => {
        if (info?.username !== this.authorFullInfo.username) {
          this.authUser = info!;
          this.showFollowButton = true;
          return;
        }
        this.showFollowButton = false;
      });

    this.checkFollowingStatus();
  }

  checkFollowingStatus() {
    this.checkIfFollowingAuthor();
    this.checkIfAuthorIsAFollower();
    this.checkUsersFollowingAuthorAlsoFollowingAuth();
    this.checkAuthorFollowingUsersAuthAlsoFollowing();
  }

  ngAfterViewInit(): void {
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

  followUser() {
    this.followUserSubscription = this.userservice
      .followUser(this.authUser.id, this.authorFullInfo.id)
      .subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            this.authorFullInfo = response.data;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
        complete: () => {
          this.checkFollowingStatus();
          this.followUserSubscription?.unsubscribe();
        },
      });
  }

  unfollowUser() {
    this.unfollowUserSubscription = this.userservice
      .unfollowUser(this.authUser.id, this.authorFullInfo.id)
      .subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            this.store.dispatch(
              UserApiActions.unfollowUser({
                followId: this.authUser.id,
                followingId: this.authorFullInfo.id,
              })
            );
            this.authorFullInfo = response.data;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
        complete: () => {
          this.checkFollowingStatus();
          this.unfollowUserSubscription?.unsubscribe();
        },
      });
  }

  checkIfFollowingAuthor() {
    this.authFollowing$.subscribe((followings) => {
      const userExist = followings.find(
        (following) => following.username === this.authorFullInfo.username
      );
      userExist
        ? this.followingAuthor$.next(true)
        : this.followingAuthor$.next(false);
    });
  }

  checkIfAuthorIsAFollower() {
    this.authFollowers$.subscribe((follower) => {
      const userExist = follower.find(
        (follower) => follower.username === this.authorFullInfo.username
      );

      this.followButtonText = userExist ? 'Follow Back' : 'Follow';
    });
  }

  checkUsersFollowingAuthorAlsoFollowingAuth() {
    this.authFollowers$
      .pipe(
        filter(
          (followers) => followers.length > 0 && this.authUser !== undefined
        ),
        tap(() => (this.usersFollowingAuthorAlsoFollowingAuth = [])),
        switchMap((followers) => {
          return this.authorFullInfo.followersList
            .filter((username) => username !== this.authUser.username)
            .map((username) => {
              const user = followers.find(
                (follower) => follower.username === username
              );
              return user || null;
            });
        })
      )
      .subscribe((user) => {
        if (user) {
          this.usersFollowingAuthorAlsoFollowingAuth.push(user);
        }
      });
  }

  checkAuthorFollowingUsersAuthAlsoFollowing() {
    this.authFollowing$
      .pipe(
        filter(
          (following) => following.length > 0 && this.authUser !== undefined
        ),
        tap(() => (this.authorFollowingUsersAuthAlsoFollowing = [])),
        switchMap((following) => {
          return this.authorFullInfo.followingList
            .filter((username) => username !== this.authUser.username)
            .map((username) => {
              const user = following.find(
                (follower) => follower.username === username
              );
              return user || null;
            });
        })
      )
      .subscribe((user) => {
        if (user) {
          this.authorFollowingUsersAuthAlsoFollowing.push(user);
        }
      });
  }

  getFollowersDescription(users: UserSummaryInfo[]) {
    if (users.length === 1) {
      return `followed by ${users[0].username} who also follows you`;
    } else if (users.length == 2) {
      return `followed by ${users[0].username} and ${users[1].username} who follow you`;
    } else if (users.length == 3) {
      return `followed by ${users[0].username}, ${users[1].username}, and ${users[2].username} who follow you`;
    } else {
      return `followed by ${users[0].username}, ${users[1].username}, ${
        users[2].username
      } and ${users.length - 3} others who follow you`;
    }
  }

  getFollowingDescription(users: UserSummaryInfo[]) {
    if (users.length === 1) {
      return `follows ${users[0].username} whom you follow`;
    } else if (users.length == 2) {
      return `follows ${users[0].username} and ${users[1].username} whom you follow`;
    } else if (users.length == 3) {
      return `follows ${users[0].username}, ${users[1].username}, and ${users[2].username} whom you follow`;
    } else {
      return `follows ${users[0].username}, ${users[1].username}, ${
        users[2].username
      } and ${users.length - 3} others whom you follow`;
    }
  }
}
