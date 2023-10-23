import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SUCCESS_MESSAGE_TOKEN, UserInfoType, getBase64 } from 'utils';
import { Subscription } from 'rxjs';
import { SuccessMessageService, UserService } from 'services';
import { AppApiActions, AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-edit-auth-image-modal',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './edit-auth-image-modal.component.html',
  styleUrls: ['./edit-auth-image-modal.component.css'],
})
export class EditAuthImageModalComponent implements OnInit, OnDestroy {
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  editMode = false;
  image!: { base64: string; file: File };
  imageBase64!: string;
  edittedImage!: string;

  submittingForm = false;
  userInfo!: UserInfoType;
  userInfoSubscription = new Subscription();
  uploaded = false;

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private userserivce: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userInfoSubscription = this.store
      .select(getUserInformation)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.userInfo = userInfo;
        }
      });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.edittedImage = <string>event.objectUrl;
  }

  async uploadImage(event: Event) {
    this.uploaded = true;
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

  saveImage() {
    this.submittingForm = true;
    const formData = new FormData();
    formData.append('image', this.image.file);
    formData.append('user_id', this.userInfo.id.toString());

    this.userserivce.updateUserProfileImage(formData).subscribe({
      next: (response: any) => {
        this.submittingForm = false;
        console.log(response);
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.submittingForm = false;
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.image = {
          base64: '',
          file: new File([], ''),
        };
        this.uploaded = false;
        this.closeButton.nativeElement.click();
      },
    });
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
