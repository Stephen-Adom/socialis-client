/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { UserFollowersComponent } from './user-followers/user-followers.component';
import { UserFollowingComponent } from './user-following/user-following.component';
import { UserState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { UserInfoType } from 'utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-friends',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    UserFollowersComponent,
    UserFollowingComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  activeIndex = 0;
  authUser$!: Observable<UserInfoType | null>;

  constructor(private store: Store<UserState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }
}
