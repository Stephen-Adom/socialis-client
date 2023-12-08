/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserState } from 'state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UserSummaryInfo } from 'utils';

@Component({
  selector: 'lib-followers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
})
export class FollowersComponent {
  @Input({ required: true }) userFollowing: UserSummaryInfo[] = [];

  constructor(private store: Store<UserState>, private router: Router) {}

  viewDetails(following: UserSummaryInfo) {
    this.router.navigate(['user', following.username, 'profile']);
  }
}
