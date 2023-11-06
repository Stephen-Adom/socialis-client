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
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authFollowing$ = this.store.select(getAllAuthUserFollowing);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);

    this.checkIfFollowingAuthor();
    this.checkIfAuthorIsAFollower();

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
}
