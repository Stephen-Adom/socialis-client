/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryMediaType, WatchedByType } from 'utils';
import { DialogModule } from 'primeng/dialog';
import { formatDistanceToNow } from 'date-fns';
import { StoryUploadService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions, AppState } from 'state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-story-slide',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './story-slide.component.html',
  styleUrls: ['./story-slide.component.css'],
})
export class StorySlideComponent implements OnDestroy {
  @Input({ required: true }) story!: StoryMediaType;
  @Input({ required: true }) activeIndex!: number | null;
  watchedDialogvisible = false;
  watchedBy: WatchedByType[] = [];
  watchedUserSubscription = new Subscription();

  constructor(
    private storyUploadService: StoryUploadService,
    private store: Store<AppState>
  ) {}

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
