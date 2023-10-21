/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'lib-edit-cover-background-modal',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './edit-cover-background-modal.component.html',
  styleUrls: ['./edit-cover-background-modal.component.css'],
})
export class EditCoverBackgroundModalComponent {
  imageURL =
    'https://res.cloudinary.com/dt8tdf7uu/image/upload/v1688563062/cld-sample-5.jpg';
  cropImgPreview!: string | null | undefined;

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }

  imgLoad(e: ImageCroppedEvent) {
    console.log(e);
  }

  imgFailed(e: ImageCroppedEvent) {
    console.log(e);
  }
}
