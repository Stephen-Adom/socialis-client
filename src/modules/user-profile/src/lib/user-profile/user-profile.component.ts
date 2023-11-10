/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  AppApiActions,
  UserApiActions,
  UserState,
  getAllAuthUserFollowers,
  getAllAuthUserFollowing,
  getAuthorInformation,
  getTotalPostsByUser,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  filter,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { UserInfoType, UserSummaryInfo, UserSummaryInfoFollowing } from 'utils';
import { format } from 'date-fns';
import {
  AllUserPostComponent,
  AllUserRepliesComponent,
  AllUserLikedPostsComponent,
  AllUserCommentComponent,
} from 'profile';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    AllUserPostComponent,
    AllUserRepliesComponent,
    AllUserLikedPostsComponent,
    AllUserCommentComponent,
  ],

  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  routeSubscription = new Subscription();
  authorInfo$!: Observable<UserSummaryInfoFollowing | null>;
  totalPosts$!: Observable<number>;
  authUser$!: Observable<UserInfoType | null>;
  authFollowing$!: Observable<UserSummaryInfo[]>;
  authFollowers$!: Observable<UserSummaryInfo[]>;
  followingAuthorSubscription: Subscription | undefined;
  authorIsAFollowerSubscription: Subscription | undefined;
  followingAuthor$ = new BehaviorSubject<boolean>(false);
  followButtonText = 'Follow';
  usersFollowingAuthorAlsoFollowingAuth: UserSummaryInfo[] = [];
  authorFollowingUsersAuthAlsoFollowing: UserSummaryInfo[] = [];
  followUserSubscription: Subscription | undefined;
  unfollowUserSubscription: Subscription | undefined;
  followingButtonText = `<svg
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

  constructor(
    private userservice: UserService,
    private sanitizer: DomSanitizer,
    private store: Store<UserState>,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authorInfo$ = this.store.select(getAuthorInformation);
    this.totalPosts$ = this.store.select(getTotalPostsByUser);
    this.authUser$ = this.store.select(getUserInformation);

    this.authFollowing$ = this.store.select(getAllAuthUserFollowing);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);

    this.route.paramMap.subscribe((data) => {
      this.store.dispatch(
        UserApiActions.fetchUserDetails({ username: data.get('username')! })
      );
    });

    this.checkIfFollowingAuthor();
    this.checkIfAuthorIsAFollower();
    this.checkUsersFollowingAuthorAlsoFollowingAuth();
    this.checkAuthorFollowingUsersAuthAlsoFollowing();
  }

  updateTextButton() {
    this.followingButtonText = `
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

  updateTextButtonDefault() {
    this.followingButtonText = `<svg
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

  sanitizeHtml(followingButtonText: string) {
    return this.sanitizer.bypassSecurityTrustHtml(followingButtonText);
  }

  back() {
    this.location.back();
  }

  getImage(authorInfo: UserSummaryInfoFollowing | null) {
    return authorInfo?.coverImageUrl
      ? authorInfo.coverImageUrl
      : 'assets/images/abstract-banner.jpg';
  }

  formatCreatedAt(createdAt: string) {
    return format(new Date(createdAt), 'MMMM, yyyy');
  }

  checkIfFollowingAuthor() {
    this.followingAuthorSubscription = combineLatest([
      this.authFollowing$,
      this.authorInfo$,
    ]).subscribe(([followings, authorInfo]) => {
      console.log(followings, authorInfo);
      if (followings.length && authorInfo) {
        const userExist = followings.find(
          (following) => following.username === authorInfo.username
        );
        userExist
          ? this.followingAuthor$.next(true)
          : this.followingAuthor$.next(false);
      }
    });
  }

  checkIfAuthorIsAFollower() {
    this.authorIsAFollowerSubscription = combineLatest([
      this.authFollowers$,
      this.authorInfo$,
    ]).subscribe(([followers, authorInfo]) => {
      if (followers.length && authorInfo) {
        const userExist = followers.find(
          (follower) => follower.username === authorInfo.username
        );

        this.followButtonText = userExist ? 'Follow Back' : 'Follow';
      }
    });
  }

  checkUsersFollowingAuthorAlsoFollowingAuth() {
    combineLatest([this.authFollowers$, this.authUser$, this.authorInfo$])
      .pipe(
        filter(
          ([followers, authUser]) =>
            followers.length > 0 && authUser !== undefined
        ),
        switchMap(([followers, authUser, authorInfo]) => {
          const usersToCheck = authorInfo?.followersList.filter(
            (username) => username !== authUser?.username
          );
          return of(
            usersToCheck
              ?.map((username) => {
                const user = followers.find(
                  (follower) => follower.username === username
                );
                return user || null;
              })
              .filter((user) => user)
          );
        })
      )
      .subscribe((users: any) => {
        console.log(users);
        this.usersFollowingAuthorAlsoFollowingAuth = users;
      });
  }

  checkAuthorFollowingUsersAuthAlsoFollowing() {
    combineLatest([this.authFollowing$, this.authUser$, this.authorInfo$])
      .pipe(
        filter(
          ([followings, authUser]) =>
            followings.length > 0 && authUser !== undefined
        ),
        switchMap(([followings, authUser, authorInfo]) => {
          const usersToCheck = authorInfo?.followingList.filter(
            (username) => username !== authUser?.username
          );
          return of(
            usersToCheck
              ?.map((username) => {
                const user = followings.find(
                  (following) => following.username === username
                );
                return user || null;
              })
              .filter((user) => user)
          );
        })
      )
      .subscribe((users: any) => {
        console.log(users);
        this.authorFollowingUsersAuthAlsoFollowing = users;
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

  unfollowUser() {
    let authUser: any;
    let authorInfo: any;
    this.authUser$.subscribe((data) => (authUser = data));
    this.authorInfo$.subscribe((data) => (authorInfo = data));

    if (authUser !== null && authorInfo !== null) {
      this.unfollowUserSubscription = this.userservice
        .unfollowUser(authUser?.id as number, authorInfo?.id as number)
        .subscribe({
          next: (response) => {
            if (response.status === 'OK') {
              this.store.dispatch(
                UserApiActions.fetchUserDetailsSuccess({ userInfo: response })
              );

              this.store.dispatch(
                UserApiActions.unfollowUser({
                  followId: authUser.id,
                  followingId: authorInfo.id,
                })
              );
            }
          },
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
  }

  followUser() {
    let authUser: any;
    let authorInfo: any;
    this.authUser$.subscribe((data) => (authUser = data));
    this.authorInfo$.subscribe((data) => (authorInfo = data));

    if (authUser !== null && authorInfo !== null) {
      this.followUserSubscription = this.userservice
        .followUser(authUser?.id as number, authorInfo?.id as number)
        .subscribe({
          next: (response) => {
            if (response.status === 'OK') {
              this.store.dispatch(
                UserApiActions.fetchUserDetailsSuccess({ userInfo: response })
              );
            }
          },
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
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.followingAuthorSubscription?.unsubscribe();
    this.authorIsAFollowerSubscription?.unsubscribe();
  }
}
