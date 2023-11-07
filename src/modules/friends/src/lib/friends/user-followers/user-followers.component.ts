/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UserApiActions,
  UserState,
  getAllAuthUserFollowers,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { UserInfoType, UserSummaryInfo } from 'utils';
import { FriendCardComponent } from 'friend-card';

@Component({
  selector: 'lib-user-followers',
  standalone: true,
  imports: [CommonModule, FriendCardComponent],
  templateUrl: './user-followers.component.html',
  styleUrls: ['./user-followers.component.scss'],
})
export class UserFollowersComponent implements OnInit {
  authUser$!: Observable<UserInfoType | null>;
  followers$!: Observable<UserSummaryInfo[]>;

  constructor(private store: Store<UserState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation).pipe(
      tap((authUser) => {
        if (authUser) {
          this.store.dispatch(
            UserApiActions.fetchAllFollowers({ username: authUser.username })
          );
        }
      })
    );
    this.followers$ = this.store.select(getAllAuthUserFollowers);
  }
}
