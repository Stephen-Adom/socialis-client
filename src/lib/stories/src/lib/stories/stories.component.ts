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
  swiperEl: any;
  authUser$!: Observable<UserInfoType | null>;
  videoFile: any;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();

    fromEvent(this.video.nativeElement, 'loadedmetadata').subscribe((data) => {
      console.log(data, 'video element');
    });
  }

  initializeSwiper() {
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
    Object.assign(this.swiperContainer.nativeElement, swiperParams);
    // and now initialize it
    this.swiperContainer.nativeElement.initialize();
    console.log(this.swiperContainer);
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

  async onFileChange(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > 100000000) {
          return;
        } else {
          return;
        }
      }
    }
  }
}
