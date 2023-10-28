/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiActions, PostApiActions, PostState } from 'state';
import {
  ConfirmDeleteService,
  PostService,
  SuccessMessageService,
  dataDeleteObject,
} from 'services';
import { PostType, SUCCESS_MESSAGE_TOKEN } from 'utils';
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
  postData!: dataDeleteObject | null;

  constructor(
    private store: Store<PostState>,
    private postservice: PostService,
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessage: SuccessMessageService,
    private confirmDeleteService: ConfirmDeleteService
  ) {}

  ngOnInit(): void {
    this.confirmDeleteService.deletePostObservable.subscribe((data) => {
      if (data) {
        this.postData = data;
      }
    });
  }

  deleteData() {
    console.log(this.postData);
    // switch (this.postData?.type) {
    //   case 'post':

    //     break;

    //   default:
    //     break;
    // }
  }

  clearData() {
    this.postData = null;
  }

  deletePost(post: PostType) {
    this.store.dispatch(PostApiActions.deletePost({ postId: post.id }));
    this.postservice.deletePost(post.id).subscribe({
      next: (response: any) => {
        this.successMessage.sendSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.store.dispatch(
          AppApiActions.displayErrorMessage({ error: error.error })
        );
      },
    });
  }
}
