import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'lib-stories',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent implements AfterViewInit {
  swiperEl: any;

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  initializeSwiper() {
    this.swiperEl = document.querySelector('swiper-container');
    if (this.swiperEl) {
      // swiper parameters
      const swiperParams = {
        slidesPerView: 2,
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
        },
        on: {
          init() {
            // ...
          },
        },
      };

      // now we need to assign all parameters to Swiper element
      Object.assign(this.swiperEl, swiperParams);
      // and now initialize it
      this.swiperEl.initialize();
    }
  }

  nextSlide() {
    if (this.swiperEl) {
      this.swiperEl.swiper.slideNext();
    }
  }

  prevSlide() {
    if (this.swiperEl) {
      this.swiperEl.swiper.slidePrev();
    }
  }
}
