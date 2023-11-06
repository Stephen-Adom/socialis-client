/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoType, UserSummaryInfo } from 'utils';
import {
  AppState,
  UserApiActions,
  getAllAuthUserFollowers,
  getAllAuthUserFollowing,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, filter, switchMap } from 'rxjs';

@Component({
  selector: 'lib-profile-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-tooltip.component.html',
  styleUrls: ['./profile-tooltip.component.css'],
})
export class ProfileTooltipComponent implements OnInit {
  @Input() authorInfo!: UserSummaryInfo;
  authUser!: UserInfoType;
  showFollowButton = false;
  authFollowing$!: Observable<UserSummaryInfo[]>;
  authFollowers$!: Observable<UserSummaryInfo[]>;
  followingAuthor$ = new BehaviorSubject<boolean>(false);
  followButtonText = 'Follow';
  usersFollowingAuthorAlsoFollowingAuth: UserSummaryInfo[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authFollowing$ = this.store.select(getAllAuthUserFollowing);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);

    this.store.select(getUserInformation).subscribe((info) => {
      if (
        info &&
        this.authorInfo &&
        info.username !== this.authorInfo.username
      ) {
        this.authUser = info;
        this.showFollowButton = true;
        return;
      }
      this.showFollowButton = false;
    });

    this.checkIfFollowingAuthor();
    this.checkIfAuthorIsAFollower();
    this.checkUsersFollowingAuthorAlsoFollowingAuth();
  }

  followUser() {
    this.store.dispatch(
      UserApiActions.followUser({
        followId: this.authUser.id,
        followingId: this.authorInfo.id,
      })
    );
  }

  checkIfFollowingAuthor() {
    this.authFollowing$.subscribe((followings) => {
      const userExist = followings.find(
        (following) => following.username === this.authorInfo.username
      );
      userExist
        ? this.followingAuthor$.next(true)
        : this.followingAuthor$.next(false);
    });
  }

  checkIfAuthorIsAFollower() {
    this.authFollowers$.subscribe((follower) => {
      const userExist = follower.find(
        (follower) => follower.username === this.authorInfo.username
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
        switchMap((followers) => {
          console.log(this.authUser, 'this.authuser');
          return this.authorInfo.followersList
            .filter((username) => username !== this.authUser.username)
            .map((username) => {
              const user = followers.find(
                (follower) => follower.username === username
              );
              return user || null;
            });
        }),
        filter((user) => user !== null)
      )
      .subscribe((user) => {
        if (user) {
          this.usersFollowingAuthorAlsoFollowingAuth.push(user);
          console.log(this.usersFollowingAuthorAlsoFollowingAuth);
        }
      });
  }

  getFollowingDescription(users: UserSummaryInfo[]) {
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
}
