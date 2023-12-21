import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoriesEditPreviewService {
  storiesEditPreview$ = new BehaviorSubject<boolean>(false);

  storiesEditPreviewObservable = this.storiesEditPreview$.asObservable();

  toggleStoriesEditPreview(state: boolean) {
    this.storiesEditPreview$.next(state);
  }
}
