/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoType, UserSummaryInfo } from 'utils';
import { AppState, UserApiActions, getUserInformation } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-profile-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-tooltip.component.html',
  styleUrls: ['./profile-tooltip.component.css'],
})
export class ProfileTooltipComponent implements OnInit {
  authorInfo!: UserSummaryInfo;
  authUser!: UserInfoType;
  showFollowButton = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
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
}
