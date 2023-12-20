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
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { UserInfoType, getBase64 } from 'utils';
import { Observable, fromEvent } from 'rxjs';
import { PostService } from 'services';
import { SwiperOptions } from 'swiper/types';

register();

@Component({
  selector: 'lib-stories',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent implements AfterViewInit, OnInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef<SwiperContainer>;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  authUser$!: Observable<UserInfoType | null>;
  videoFile: any;
  startTime = 0;
  endTime = 0;

  constructor(
    private postservice: PostService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  initializeSwiper() {
    const swiperParams: SwiperOptions = {
      slidesPerView: 9,
      spaceBetween: 5,
      breakpoints: {
        640: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
        1280: {
          slidesPerView: 9,
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file, 'file');
  }
}
