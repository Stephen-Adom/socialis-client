/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserState, getAllAuthUserFollowing } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserSummaryInfo } from 'utils';

@Component({
  selector: 'lib-followers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
})
export class FollowersComponent implements OnInit {
  userFollowing$!: Observable<UserSummaryInfo[]>;

  constructor(private store: Store<UserState>, private router: Router) {}

  ngOnInit(): void {
    this.userFollowing$ = this.store.select(getAllAuthUserFollowing);
  }

  viewDetails(following: UserSummaryInfo) {
    this.router.navigate(['user', following.username, 'profile']);
  }
}
