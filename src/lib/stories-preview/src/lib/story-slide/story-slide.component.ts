/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryMediaType, WatchedByType } from 'utils';
import { DialogModule } from 'primeng/dialog';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'lib-story-slide',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './story-slide.component.html',
  styleUrls: ['./story-slide.component.css'],
})
export class StorySlideComponent {
  @Input({ required: true }) story!: StoryMediaType;
  watchedDialogvisible = false;
  watchedBy: WatchedByType[] = [];

  viewWatched(storymedia: StoryMediaType) {
    if (storymedia.watchedBy.length) {
      this.watchedBy = storymedia.watchedBy;
      this.watchedDialogvisible = true;
    }
  }

  formatTimeWatched(time: string) {
    return formatDistanceToNow(new Date(time), {
      includeSeconds: true,
      addSuffix: true,
    });
  }
}
