/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  UserState,
  getUserInformation,
  UserApiActions,
  getAllAuthUserFollowing,
} from 'state';
import { UserInfoType, UserSummaryInfoFollowing } from 'utils';
import { FriendCardComponent } from 'friend-card';

@Component({
  selector: 'lib-user-following',
  standalone: true,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './user-following.component.html',
  styleUrls: ['./user-following.component.scss'],
})
export class UserFollowingComponent implements OnInit {
  authUser$!: Observable<UserInfoType | null>;
  following$!: Observable<UserSummaryInfoFollowing[]>;

  constructor(private store: Store<UserState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation).pipe(
      tap((authUser) => {
        if (authUser) {
          this.store.dispatch(
            UserApiActions.fetchAllFollowing({ username: authUser.username })
          );
        }
      })
    );
    this.following$ = this.store.select(getAllAuthUserFollowing);
  }
}
