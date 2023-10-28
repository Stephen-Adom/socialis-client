/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommentType, PostType, ReplyType } from 'utils';

export interface dataDeleteObject {
  data: PostType | CommentType | ReplyType;
  type: 'post' | 'comment' | 'reply';
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDeleteService {
  deletePost$ = new BehaviorSubject<dataDeleteObject | null>(null);

  deletePostObservable = this.deletePost$.asObservable();

  deletePost(data: dataDeleteObject) {
    this.deletePost$.next(data);
  }
}
