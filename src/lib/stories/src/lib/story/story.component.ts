/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryType, UserInfoType } from 'utils';
import { StoriesEditPreviewService } from 'services';
import { Observable, combineLatest } from 'rxjs';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {
  @Input({ required: true }) story!: StoryType;
  viewedAllStories = false;
  authUser$!: Observable<UserInfoType | null>;

  constructor(
    private storiesPreview: StoriesEditPreviewService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.checkIfAuthUserViewedAllStories();
  }

  viewStory() {
    this.storiesPreview.viewStory(this.story);
    this.storiesPreview.toggleStoriesPreview(true);
  }

  checkIfAuthUserViewedAllStories() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.viewedAllStories = this.story.storyMedia.every((media) =>
          media.watchedBy.find(
            (watched) => watched.user.username === authUser.username
          )
        );
      }
    });
  }
}
