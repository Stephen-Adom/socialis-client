/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  UserApiActions,
  UserState,
  getAuthorInformation,
  getTotalPostsByUser,
} from 'state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserInfoType } from 'utils';
import { format } from 'date-fns';
import {
  AllUserPostComponent,
  AllUserRepliesComponent,
  AllUserLikedPostsComponent,
  AllUserCommentComponent,
} from 'profile';

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
  authorInfo$!: Observable<UserInfoType | null>;
  totalPosts$!: Observable<number>;

  constructor(
    private store: Store<UserState>,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authorInfo$ = this.store.select(getAuthorInformation);
    this.totalPosts$ = this.store.select(getTotalPostsByUser);

    this.route.paramMap.subscribe((data) => {
      this.store.dispatch(
        UserApiActions.fetchUserDetails({ username: data.get('username')! })
      );
    });
  }

  back() {
    this.location.back();
  }

  getImage(authorInfo: UserInfoType | null) {
    return authorInfo?.coverImageUrl
      ? authorInfo.coverImageUrl
      : 'assets/images/abstract-banner.jpg';
  }

  formatCreatedAt(createdAt: string) {
    return format(new Date(createdAt), 'MMMM, yyyy');
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
