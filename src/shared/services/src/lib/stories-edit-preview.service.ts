/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { uploadMedia } from 'utils';
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

  storiesEditPreviewObservable = this.storiesEditPreview$.asObservable();
  storiesDialogObservable = this.storiesDialog$.asObservable();
  storiesEditDataPreviewObservable =
    this.storiesEditDataPreview$.asObservable();

  toggleStoriesEditPreview(state: boolean) {
    return this.storiesEditPreview$.next(state);
  }

  toggleStoriesDialog(state: boolean) {
    return this.storiesDialog$.next(state);
  }

  sendStoryData(data: { data: uploadMedia | uploadMedia[]; dataType: string }) {
    return this.storiesEditDataPreview$.next(data);
  }
}
