/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import {
  StoriesEditPreviewService,
  StoryUploadService,
  SuccessMessageService,
} from 'services';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  filter,
  switchMap,
} from 'rxjs';
import { SUCCESS_MESSAGE_TOKEN, UserInfoType, uploadMedia } from 'utils';
import { FormsModule } from '@angular/forms';
import { AppApiActions, AppState, getUserInformation } from 'state';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

register();

@Component({
  selector: 'lib-stories-edit-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories-edit-preview.component.html',
  styleUrls: ['./stories-edit-preview.component.css'],
})
export class StoriesEditPreviewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;
  storiesDisplay$!: Observable<boolean>;
  activeIndex = 0;
  singleStoriesData!: uploadMedia | null;
  multipleStoriesData: uploadMedia[] = [];
  dataType!: string;
  authUser!: UserInfoType;
  authUserSubscription: Subscription | undefined;
  videoLengthAlert$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private storiesPreview: StoriesEditPreviewService,
    private uploadService: StoryUploadService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.storiesDisplay$ = this.storiesPreview.storiesEditPreviewObservable;

    this.authUserSubscription = this.store
      .select(getUserInformation)
      .subscribe((data) => {
        if (data) {
          this.authUser = data;
        }
      });

    this.storiesPreview.storiesEditDataPreviewObservable.subscribe((data) => {
      if (data) {
        this.dataType = data?.dataType;

        if (this.dataType === 'multiple') {
          this.multipleStoriesData = data?.data as uploadMedia[];
        } else {
          this.singleStoriesData = data?.data as uploadMedia;
        }

        this.checkMediaType();
      }
    });

    this.videoLengthAlert$
      .pipe(
        filter((status) => status === true),
        debounceTime(5000)
      )
      .subscribe(() => {
        this.videoLengthAlert$.next(false);
      });
  }

  ngAfterViewInit(): void {
    const swiperParams: SwiperOptions = {
      slidesPerView: 1,
      spaceBetween: 5,
      pagination: false,
      navigation: false,
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
        },
        1280: {
          slidesPerView: 1,
        },
      },
      on: {
        init() {
          // ...
        },
      },
    };

    // now we need to assign all parameters to Swiper element
    if (this.swiperContainer) {
      Object.assign(this.swiperContainer.nativeElement, swiperParams);
      this.swiperContainer.nativeElement.initialize();
    }
  }

  ngOnDestroy(): void {
    this.authUserSubscription?.unsubscribe();
  }

  checkMediaType() {
    console.log(this.multipleStoriesData, 'single stories data');
    if (this.singleStoriesData?.fileType.includes('video')) {
      this.videoLengthAlert$.next(true);
    } else {
      this.videoLengthAlert$.next(false);
    }
  }

  nextSlide() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slideNext();
      this.activeIndex++;
    }
  }

  prevSlide() {
    if (this.swiperContainer) {
      this.swiperContainer.nativeElement.swiper.slidePrev();
      this.activeIndex--;
    }
  }

  closeEditPreview() {
    this.resetData();
    this.storiesPreview.toggleStoriesEditPreview(false);
  }

  resetData() {
    this.activeIndex = 0;
    this.singleStoriesData = null;
    this.multipleStoriesData = [];
    this.dataType = '';
  }

  moveToSlide(index: number) {
    this.swiperContainer.nativeElement.swiper.slideTo(index);
    this.activeIndex = index;
  }

  removeMedia(index: number) {
    this.multipleStoriesData.splice(index, 1);
  }

  uploadStory() {
    if (this.dataType === 'single') {
      this.uploadSingleMedia();
    } else {
      this.uploadMultipleMedia();
      return;
    }
  }

  uploadSingleMedia() {
    const formData = new FormData();
    formData.append('storyMedia', this.singleStoriesData?.file as File);
    formData.append('caption', this.singleStoriesData?.caption as string);

    this.store.dispatch(AppApiActions.uploadingStory({ uploading: true }));
    this.storiesPreview.toggleStoriesEditPreview(false);
    this.storiesPreview.toggleStoriesDialog(false);

    const sub = this.uploadService
      .uploadStory(formData, this.authUser.id)
      .subscribe({
        next: (response) => {
          if (response && response['status'] === 'OK') {
            this.successMessage.sendSuccessMessage(response['message']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.store.dispatch(
            AppApiActions.displayErrorMessage({ error: error.error })
          );
        },
        complete: () => {
          this.store.dispatch(
            AppApiActions.uploadingStory({ uploading: false })
          );
          this.closeEditPreview();
          sub.unsubscribe();
        },
      });
  }

  uploadMultipleMedia() {
    if (this.multipleStoriesData.length) {
      const formData = new FormData();

      this.multipleStoriesData.forEach((story) => {
        console.log(story.caption, 'caption');
        formData.append('storyMedia', story.file as File);
        formData.append('caption', story.caption as string);
      });

      this.store.dispatch(AppApiActions.uploadingStory({ uploading: true }));
      this.storiesPreview.toggleStoriesEditPreview(false);
      this.storiesPreview.toggleStoriesDialog(false);

      const sub = this.uploadService
        .uploadMultipleStory(formData, this.authUser.id)
        .subscribe({
          next: (response) => {
            if (response && response['status'] === 'OK') {
              this.successMessage.sendSuccessMessage(response['message']);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.store.dispatch(
              AppApiActions.displayErrorMessage({ error: error.error })
            );
          },
          complete: () => {
            this.store.dispatch(
              AppApiActions.uploadingStory({ uploading: false })
            );
            this.closeEditPreview();
            sub.unsubscribe();
          },
        });
    }
  }
}
