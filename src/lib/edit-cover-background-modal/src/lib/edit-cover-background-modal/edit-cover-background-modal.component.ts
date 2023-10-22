/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getBase64 } from 'utils';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'lib-edit-cover-background-modal',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './edit-cover-background-modal.component.html',
  styleUrls: ['./edit-cover-background-modal.component.css'],
})
export class EditCoverBackgroundModalComponent implements OnInit {
  editMode = false;
  imageBase64!: string;
  edittedImage!: string;

  ngOnInit(): void {
    console.log('object');
  }

  image!: { base64: string; file: File };

  async uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      const file = <File>target.files[0];
      const base64String = <string>await getBase64(file);
      this.image = {
        base64: base64String,
        file: file,
      };
      this.imageBase64 = base64String;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.edittedImage = <string>event.objectUrl;
  }

  imageLoaded() {
    console.log('object');
  }

  saveEditChanges() {
    if (this.edittedImage) {
      this.image.base64 = this.edittedImage;

      this.urlToFile(this.edittedImage).then((file) => {
        this.image.file = file;
      });
    }
    this.editMode = false;
  }

  async urlToFile(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return new File([blob], filename, { type: blob.type });
  }
}
