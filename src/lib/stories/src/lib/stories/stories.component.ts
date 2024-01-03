/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperContainer, register } from 'swiper/element/bundle';
import {
  AppState,
  StoryApiActions,
  getAllFollowingStories,
  getAuthUserStories,
  getUploadStoryStatus,
  getUserInformation,
} from 'state';
import { Store } from '@ngrx/store';
import { StoryType, UserInfoType } from 'utils';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  takeUntil,
} from 'rxjs';
import { StoriesEditPreviewService } from 'services';
import { SwiperOptions } from 'swiper/types';
import { StoryComponent } from '../story/story.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

register();

@Component({
  selector: 'lib-stories',
  standalone: true,
  imports: [CommonModule, StoryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  authUser$!: Observable<UserInfoType | null>;
  uploadingStory$!: Observable<boolean>;
  authStories$!: Observable<StoryType | null>;
  followingStories$!: Observable<StoryType[]>;
  viewedAllStories = false;
  currentScreenSize!: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  destroyed = new Subject<void>();

  constructor(
    private storiesPreview: StoriesEditPreviewService,
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.uploadingStory$ = this.store.select(getUploadStoryStatus);
    this.authStories$ = this.store.select(getAuthUserStories);
    this.followingStories$ = this.store.select(getAllFollowingStories);
    this.fetchUserStories();
    this.checkIfAuthUserViewedAllStories();
  }

  fetchUserStories() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        this.store.dispatch(
          StoryApiActions.fetchAuthUserStories({ userId: authUser.id })
        );

        this.store.dispatch(
          StoryApiActions.fetchAllFollowingStories({ userId: authUser.id })
        );
      }
    });
  }

  checkIfAuthUserViewedAllStories() {
    combineLatest([this.authUser$, this.authStories$]).subscribe(
      ([authUser, authStories]) => {
        if (authUser && authStories) {
          this.viewedAllStories = authStories.storyMedia.every((media) =>
            media.watchedBy.find(
              (watched) => watched.user.username === authUser.username
            )
          );
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.followingStories$.pipe(debounceTime(100)).subscribe((stories) => {
      if (stories) {
        this.initializeSwiper();
      }
    });
  }

  initializeSwiper() {
    const swiperParams: SwiperOptions = {
      slidesPerView: this.getSlidePerView(),
      spaceBetween: 0,
      on: {
        init() {
          // ...
        },
      },
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(this.swiperContainer.nativeElement, swiperParams);
    // and now initialize it
    this.swiperContainer.nativeElement.swiper.updateSlides();
  }

  getSlidePerView() {
    switch (this.currentScreenSize) {
      case 'XSmall':
        return 3;
      case 'Small':
        return 5;
      case 'Medium':
        return 7;
      case 'Large':
        return 7;
      case 'XLarge':
        return 7;
      default:
        return 7;
    }
  }

  nextSlide() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slideNext();
    }
  }

  prevSlide() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slidePrev();
    }
  }

  addStory() {
    this.storiesPreview.toggleStoriesDialog(true);
  }

  viewStory(story: StoryType) {
    this.storiesPreview.viewStory(story);
    this.storiesPreview.toggleStoriesPreview(true);
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
