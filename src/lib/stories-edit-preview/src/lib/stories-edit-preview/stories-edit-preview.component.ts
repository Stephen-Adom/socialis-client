import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';

register();

@Component({
  selector: 'lib-stories-edit-preview',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories-edit-preview.component.html',
  styleUrls: ['./stories-edit-preview.component.css'],
})
export class StoriesEditPreviewComponent implements AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;
  activeIndex = 0;

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
    Object.assign(this.swiperContainer.nativeElement, swiperParams);
    // and now initialize it
    this.swiperContainer.nativeElement.initialize();
    // this.swiperContainer.nativeElement.swiper.
    console.log(this.swiperContainer);
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
}
