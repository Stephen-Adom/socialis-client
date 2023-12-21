/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { StoriesEditPreviewService } from 'services';
import { Observable } from 'rxjs';
import { uploadMedia } from 'utils';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

register();

@Component({
  selector: 'lib-stories-edit-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories-edit-preview.component.html',
  styleUrls: ['./stories-edit-preview.component.css'],
})
export class StoriesEditPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;
  storiesDisplay$!: Observable<boolean>;
  activeIndex = 0;
  singleStoriesData!: uploadMedia;
  multipleStoriesData: uploadMedia[] = [];
  dataType!: string;

  constructor(private storiesPreview: StoriesEditPreviewService) {}

  ngOnInit(): void {
    this.storiesDisplay$ = this.storiesPreview.storiesEditPreviewObservable;

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
    this.storiesPreview.toggleStoriesEditPreview(false);
  }

  moveToSlide(index: number) {
    this.swiperContainer.nativeElement.swiper.slideTo(index);
    this.activeIndex = index;
  }

  removeMedia(index: number) {
    this.multipleStoriesData.splice(index, 1);
  }
}
