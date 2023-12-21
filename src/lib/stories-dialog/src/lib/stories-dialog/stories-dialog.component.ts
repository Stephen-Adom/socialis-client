/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { StoriesEditPreviewService } from 'services';
import { Subscription } from 'rxjs';
import { getBase64, uploadMedia } from 'utils';

@Component({
  selector: 'lib-stories-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './stories-dialog.component.html',
  styleUrls: ['./stories-dialog.component.css'],
})
export class StoriesDialogComponent implements OnInit, OnDestroy {
  visible = false;
  position = 'bottom' as const;
  storiesDialogSubscription = new Subscription();

  singleUploadMedia: uploadMedia = {
    file: null!,
    base64: '',
    caption: '',
    fileType: '',
  };

  constructor(private storiesEditPreview: StoriesEditPreviewService) {}

  ngOnInit(): void {
    this.storiesDialogSubscription =
      this.storiesEditPreview.storiesDialogObservable.subscribe((state) => {
        this.visible = state;
      });
  }

  onHide() {
    this.storiesEditPreview.toggleStoriesDialog(false);
  }

  ngOnDestroy(): void {
    this.storiesDialogSubscription.unsubscribe();
  }

  async onFileChange(event: Event) {
    const file = (<HTMLInputElement>event.target)?.files?.[0];
    if (file) {
      console.log(file);
      const base64 = await getBase64(file);

      Object.assign(this.singleUploadMedia, {
        file,
        base64,
        caption: '',
        fileType: file.type.includes('image') ? 'image' : 'video',
      });

      this.storiesEditPreview.sendStoryData({
        data: this.singleUploadMedia,
        dataType: 'single',
      });
      this.storiesEditPreview.toggleStoriesEditPreview(true);
    }
  }

  onMultipleFileChange(event: Event) {
    return;
  }
}
