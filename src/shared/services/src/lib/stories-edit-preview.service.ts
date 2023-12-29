/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoryType, uploadMedia } from 'utils';
@Injectable({
  providedIn: 'root',
})
export class StoriesEditPreviewService {
  storiesEditPreview$ = new BehaviorSubject<boolean>(false);
  storiesEditDataPreview$ = new BehaviorSubject<{
    data: uploadMedia | uploadMedia[] | null;
    dataType: string;
  } | null>(null);
  storiesDialog$ = new BehaviorSubject<boolean>(false);
  storiesPreview$ = new BehaviorSubject<boolean>(false);
  viewStory$ = new BehaviorSubject<StoryType | null>(null);

  storiesEditPreviewObservable = this.storiesEditPreview$.asObservable();
  storiesDialogObservable = this.storiesDialog$.asObservable();
  storiesEditDataPreviewObservable =
    this.storiesEditDataPreview$.asObservable();
  storiesPreviewObservable = this.storiesPreview$.asObservable();
  viewStoryObservable = this.viewStory$.asObservable();

  toggleStoriesEditPreview(state: boolean) {
    return this.storiesEditPreview$.next(state);
  }

  toggleStoriesDialog(state: boolean) {
    return this.storiesDialog$.next(state);
  }

  sendStoryData(data: { data: uploadMedia | uploadMedia[]; dataType: string }) {
    return this.storiesEditDataPreview$.next(data);
  }

  toggleStoriesPreview(state: boolean) {
    return this.storiesPreview$.next(state);
  }

  viewStory(story: StoryType) {
    return this.viewStory$.next(story);
  }
}
