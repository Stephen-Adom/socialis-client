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
import { SwiperOptions } from 'swiper/types';
import { StoriesEditPreviewService, StoryUploadService } from 'services';
import { Observable, Subscription } from 'rxjs';
import { UserInfoType, uploadMedia } from 'utils';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';

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

  constructor(
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
        }
        this.singleStoriesData = data?.data as uploadMedia;
      }
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
      return;
    }
  }

  uploadSingleMedia() {
    const uploadData: { file: File; caption: string } = {
      file: this.singleStoriesData?.file as File,
      caption: this.singleStoriesData?.caption as string,
    };

    const sub = this.uploadService
      .uploadStory(uploadData, this.authUser.id)
      .subscribe({
        next: () => {
          this.closeEditPreview();
        },
        error: () => {
          this.closeEditPreview();
        },
        complete: () => {
          sub.unsubscribe();
        },
      });
    this.closeEditPreview();
  }
}
