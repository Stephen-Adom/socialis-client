/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType, ImageType, PostType, ReplyType } from 'utils';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { formatDistanceToNow } from 'date-fns';
import { FormatPostService } from 'services';

@Component({
  selector: 'lib-media-info',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.css'],
})
export class MediaInfoComponent {
  @Input({ required: true }) postImages: ImageType[] = [];
  @Input({ required: true }) post!: PostType | CommentType | ReplyType;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  constructor(private formatPost: FormatPostService) {}

  getSubHtml() {
    return `  <div class="card-header flex items-center justify-center pb-3">
    <div class="flex-shrink-0 group block">
      <div
        class="flex items-center relative group"
      >
        <img
          class="inline-block flex-shrink-0 h-[3.5rem] w-[3.5rem] rounded-full" src="${
            this.post.user.imageUrl
              ? this.post.user.imageUrl
              : 'assets/images/users/default.jpg'
          }" alt="Image Description" />
        <div class="ml-3 text-left">
          <a
            href="javascript:;"
            class="font-semibold text-gray-800 dark:text-dark-text flex items-center space-x-2"
          >
            <span>${this.post.user.firstname} ${this.post.user.lastname}</span>
          </a>
          <div class="flex items-center gap-x-1">
            <a href="" class="font-medium text-gray-400 text-xs">
              @${this.post.user.username}
            </a>
            <span class="inline-block">
              <svg
                class="h-3 w-3 text-gray-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
            <span
              class="inline-block text-xs text-gray-400 italic"
              >${this.formatDate()}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-body dark:text-dark-text ml-0 md:ml-[68px] w-[50%] !mx-auto">
    <p class="!text-base">${this.post.content}</p>
  </div>`;
  }

  formatDate() {
    return formatDistanceToNow(new Date(this.post.createdAt), {
      includeSeconds: true,
    });
  }
}
