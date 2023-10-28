/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiActions, PostApiActions, PostState } from 'state';
import {
  ActionProgressService,
  ConfirmDeleteService,
  PostService,
  SuccessMessageService,
  dataDeleteObject,
} from 'services';
import { SUCCESS_MESSAGE_TOKEN } from 'utils';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css'],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;
  postData!: dataDeleteObject | null;

  constructor(
    private store: Store<PostState>,
    private postservice: PostService,
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private confirmDeleteService: ConfirmDeleteService,
    private actionProgessService: ActionProgressService
  ) {}

  ngOnInit(): void {
    this.confirmDeleteService.deletePostObservable.subscribe((data) => {
      if (data) {
        this.postData = data;
      }
    });
  }

  deleteData() {
    switch (this.postData?.type) {
      case 'post':
        this.deletePost(this.postData.data);
        this.clearData();
        break;

      default:
        break;
    }
  }

  clearData() {
    this.postData = null;
    this.closeBtn.nativeElement.click();
  }

  deletePost(postId: number) {
    this.store.dispatch(PostApiActions.deletePost({ postId }));
    this.actionProgessService.toggleActionInProgress(true);
    this.postservice.deletePost(postId).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
      complete: () => {
        this.actionProgessService.toggleActionInProgress(false);
      },
    });
  }
}
