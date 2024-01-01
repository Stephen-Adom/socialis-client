/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryMediaType, UserInfoType, WatchedByType } from 'utils';
import { DialogModule } from 'primeng/dialog';
import { formatDistanceToNow } from 'date-fns';
import { StoryUploadService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions, AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'lib-story-slide',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './story-slide.component.html',
  styleUrls: ['./story-slide.component.css'],
})
export class StorySlideComponent implements OnDestroy, OnInit {
  @Input({ required: true }) story!: StoryMediaType;
  @Input({ required: true }) activeIndex!: number | null;
  @Input({ required: true }) author!: string;
  watchedDialogvisible = false;
  watchedBy: WatchedByType[] = [];
  watchedUserSubscription = new Subscription();
  authUser$!: Observable<UserInfoType | null>;

  constructor(
    private storyUploadService: StoryUploadService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }

  viewWatched(storymedia: StoryMediaType) {
    this.watchedBy = storymedia.watchedBy;
    this.watchedDialogvisible = true;
    this.updateWatchedUsers();
  }

  updateWatchedUsers() {
    this.watchedUserSubscription = this.storyUploadService
      .fetchAllWatchedUserStories(this.story.id)
      .subscribe({
        next: (response) => {
          this.watchedBy = response.data;
        },
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
      });
  }

  formatTimeWatched(time: string) {
    return formatDistanceToNow(new Date(time), {
      includeSeconds: true,
      addSuffix: true,
    });
  }

  ngOnDestroy(): void {
    this.watchedUserSubscription.unsubscribe();
  }
}
