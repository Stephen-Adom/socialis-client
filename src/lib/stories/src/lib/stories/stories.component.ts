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
import Hls from 'hls.js';

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

    // console.log(ffmpeg, 'ffmpeg');

    // fromEvent(this.video.nativeElement, 'loadedmetadata').subscribe((data) => {
    //   console.log(data, 'video element');
    // });
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file, 'file');
    this.uploadStory(file);
  }

  uploadStory(file: File) {
    const formData = new FormData();
    formData.append('video', file);

    this.postservice.uploadStories(formData).subscribe((data: any) => {
      if (data) {
        if (data.success) {
          this.videoFile = data.data;
          console.log(data, ' data');
          // 设置封面
          this.video.nativeElement.poster = data.data.poster;

          // 渲染到播放器
          const hls = new Hls();
          hls.loadSource(data.data.m3u8);
          hls.attachMedia(this.video.nativeElement);
        } else {
          console.log(data.message);
        }
      }
    });
  }
}
