/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserApiActions, UserState, getAuthorInformation } from 'state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserInfoType } from 'utils';

@Component({
  selector: 'lib-user-profile',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  routeSubscription = new Subscription();
  authorInfo$!: Observable<UserInfoType | null>;

  constructor(private store: Store<UserState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authorInfo$ = this.store.select(getAuthorInformation);

    this.route.paramMap.subscribe((data) => {
      this.store.dispatch(
        UserApiActions.fetchUserDetails({ username: data.get('username')! })
      );
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
