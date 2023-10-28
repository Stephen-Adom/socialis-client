/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface dataDeleteObject {
  data: number;
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
