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
import { StoriesEditPreviewService } from 'services';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StoryType } from 'utils';

@Component({
  selector: 'lib-stories-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private storiesPreview: StoriesEditPreviewService) {}

  ngOnInit(): void {
    this.visible$ = this.storiesPreview.storiesPreviewObservable;

    this.storyInfoSubscription =
      this.storiesPreview.viewStoryObservable.subscribe((data) => {
        if (data) {
          this.storyInfo = data;
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
    this.storiesPreview.toggleStoriesPreview(false);
    this.storyInfo = null;
  }

  ngOnDestroy(): void {
    this.storyInfoSubscription.unsubscribe();
  }

  recordStoryWatchers() {
    this.visible$.subscribe((data) => {
      if (data) {
        this.trackMediaIndex();
      }
    });
  }

  trackMediaIndex() {
    this.activeIndex$.subscribe((index) => {
      if (index) {
        console.log(this.storyInfo?.storyMedia[index], 'index');
        console.log(index, 'index');
      }
    });
  }
}
