/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyType, UserInfoType } from 'utils';
import { Observable } from 'rxjs';
import { PostApiActions, PostState, getAllRepliesByUser } from 'state';
import { Store } from '@ngrx/store';
import { NoPostsComponent } from 'no-posts';
import { ReplyCardComponent } from 'comment-reply-modal';

@Component({
  selector: 'lib-all-user-replies',
  standalone: true,
  imports: [CommonModule, NoPostsComponent, ReplyCardComponent],
  templateUrl: './all-user-replies.component.html',
  styleUrls: ['./all-user-replies.component.scss'],
})
export class AllUserRepliesComponent implements OnInit, OnChanges {
  @Input({ required: true }) authUser!: UserInfoType | null;
  allReplies$!: Observable<ReplyType[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allReplies$ = this.store.select(getAllRepliesByUser);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authUser'].currentValue) {
      this.store.dispatch(
        PostApiActions.fetchAllRepliesByUser({
          userId: changes['authUser'].currentValue.id,
        })
      );
    }
  }
}
