/* eslint-disable @nx/enforce-module-boundaries */
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperContainer } from 'swiper/element';
import { StoriesEditPreviewService, StoryUploadService } from 'services';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StoryMediaType, StoryType, UserInfoType } from 'utils';
import { DialogModule } from 'primeng/dialog';
import { format } from 'date-fns';
import {
  AppApiActions,
  AppState,
  StoryApiActions,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { StorySlideComponent } from '../story-slide/story-slide.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-stories-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, StorySlideComponent, DialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories-preview.component.html',
  styleUrls: ['./stories-preview.component.css'],
})
export class StoriesPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;
  visible$!: Observable<boolean>;
  activeIndex$ = new BehaviorSubject<number>(0);
  storyInfo!: StoryType | null;
  storyInfoSubscription = new Subscription();
  authUser: UserInfoType | null = null;
  authUserSubscription = new Subscription();
  visible = false;
  currentStoryMedia!: StoryMediaType | null;
  watchedUserSubscription = new Subscription();

  constructor(
    private storiesPreview: StoriesEditPreviewService,
    private storyUploadService: StoryUploadService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.visible$ = this.storiesPreview.storiesPreviewObservable;

    this.storyInfoSubscription =
      this.storiesPreview.viewStoryObservable.subscribe((data) => {
        if (data) {
          this.storyInfo = data;
        }
      });

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((data) => {
        if (data) {
          this.authUser = data;
        }
      });

    this.recordStoryWatchers();
  }

  nextSlide() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slideNext();
      this.activeIndex$.next(this.activeIndex$.value + 1);
    }
  }

  prevSlide() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slidePrev();
      this.activeIndex$.next(this.activeIndex$.value - 1);
    }
  }

  closePreview() {
    this.activeIndex$.next(0);
    this.storiesPreview.toggleStoriesPreview(false);
    this.storyInfo = null;
  }

  ngOnDestroy(): void {
    this.storyInfoSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    this.watchedUserSubscription.unsubscribe();
  }

  recordStoryWatchers() {
    this.visible$.subscribe((data) => {
      if (data) {
        this.saveWatchedUserInfoToDb(
          this.authUser?.id as number,
          this.storyInfo?.storyMedia[0].id as number
        );
        this.trackMediaIndex();
      }
    });
  }

  trackMediaIndex() {
    this.activeIndex$.subscribe((index) => {
      if (index) {
        this.onHide();
        this.saveWatchedUserInfoToDb(
          this.authUser?.id as number,
          this.storyInfo?.storyMedia[index].id as number
        );
      }
    });
  }

  saveWatchedUserInfoToDb(userId: number, mediaId: number) {
    this.store.dispatch(StoryApiActions.saveWatchedUser({ userId, mediaId }));
  }

  checkMediaLength() {
    return (this.storyInfo?.storyMedia as StoryMediaType[]).length > 1;
  }

  watchedDialogvisibleEvent(event: StoryMediaType) {
    if (event) {
      this.currentStoryMedia = { ...event };
      this.updateWatchedUsers();
    }
  }

  toggleWatchedDialog(event: boolean) {
    this.visible = event;
  }

  formatTimeWatched(time: string) {
    const currentDay =
      new Date(time).getDay() === new Date().getDay() ? 'Today' : 'Yesterday';
    const watchedTime = format(new Date(time), 'p');

    return currentDay + ' at ' + watchedTime;
  }

  onHide() {
    this.visible = false;
    this.currentStoryMedia = null;
  }

  updateWatchedUsers() {
    this.watchedUserSubscription = this.storyUploadService
      .fetchAllWatchedUserStories(this.currentStoryMedia?.id as number)
      .subscribe({
        next: (response) => {
          if (this.currentStoryMedia) {
            this.currentStoryMedia.watchedBy = response.data;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
      });
  }
}
