/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryType, UserInfoType } from 'utils';
import { StoriesEditPreviewService } from 'services';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit, OnChanges {
  @Input({ required: true }) story!: StoryType;
  viewedAllStories$ = new BehaviorSubject<boolean>(false);
  authUser$: Observable<UserInfoType | null> = new Observable();

  constructor(
    private storiesPreview: StoriesEditPreviewService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.checkIfAuthUserViewedAllStories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['story'] && changes['story'].currentValue) {
      this.checkIfAuthUserViewedAllStories();
    }
  }

  viewStory() {
    this.storiesPreview.viewStory(this.story);
    this.storiesPreview.toggleStoriesPreview(true);
  }

  checkIfAuthUserViewedAllStories() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const viewedAllStories = this.story.storyMedia.every((media) =>
          media.watchedBy.find(
            (watched) => watched.user.username === authUser.username
          )
        );

        this.viewedAllStories$.next(viewedAllStories);
      }
    });
  }
}
