/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoType, UserSummaryInfoFollowing } from 'utils';
import { UserState, getAllAuthUserFollowing, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, filter, tap } from 'rxjs';
import { format } from 'date-fns';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-friend-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.css'],
})
export class FriendCardComponent implements OnInit {
  @Input({ required: true }) user!: UserSummaryInfoFollowing;
  @Input({ required: true }) type!: string;
  authFollowingUser$ = new BehaviorSubject<boolean>(false);
  followingButtonText = `<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-4 h-4 dark:stroke-white"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
  />
</svg>

Following`;

  constructor(
    private store: Store<UserState>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log('friend card');
    this.store
      .select(getAllAuthUserFollowing)
      .pipe(
        filter(
          () =>
            (this.user !== null || this.user !== undefined) &&
            this.type === 'follower'
        ),
        tap((followings) => {
          const userExist = followings.find(
            (following) => following.username === this.user.username
          );
          userExist
            ? this.authFollowingUser$.next(true)
            : this.authFollowingUser$.next(false);
        })
      )
      .subscribe();
  }

  formatCreatedAt(createdAt: string) {
    return format(new Date(createdAt), 'MMMM, yyyy');
  }

  updateTextButton() {
    this.followingButtonText = `
    <svg xmlns="http://www.w3.org/2000/svg"
    fill="none" viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-4 h-4 dark:stroke-red-700">
    <path stroke-linecap="round"
    stroke-linejoin="round"
    d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>

    Unfollow
    `;
  }

  updateTextButtonDefault() {
    this.followingButtonText = `<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-4 h-4 dark:stroke-white"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
  
  Following`;
  }

  sanitizeHtml(followingButtonText: string) {
    return this.sanitizer.bypassSecurityTrustHtml(followingButtonText);
  }
}
