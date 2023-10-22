import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getBase64 } from 'utils';

@Component({
  selector: 'lib-edit-auth-image-modal',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './edit-auth-image-modal.component.html',
  styleUrls: ['./edit-auth-image-modal.component.css'],
})
export class EditAuthImageModalComponent {
  editMode = false;
  image!: { base64: string; file: File };
  imageBase64!: string;
  edittedImage!: string;

  imageCropped(event: ImageCroppedEvent) {
    this.edittedImage = <string>event.objectUrl;
  }

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
