/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType, UserInfoType } from 'utils';
import { PostApiActions, PostState, getAllCommentsByUser } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommentCardComponent } from 'comment-list';
import { NoPostsComponent } from 'no-posts';

@Component({
  selector: 'lib-all-user-comment',
  standalone: true,
  imports: [CommonModule, CommentCardComponent, NoPostsComponent],
  templateUrl: './all-user-comment.component.html',
  styleUrls: ['./all-user-comment.component.scss'],
})
export class AllUserCommentComponent implements OnInit, OnChanges {
  @Input({ required: true }) authUser!: UserInfoType | null;
  allComments$!: Observable<CommentType[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allComments$ = this.store.select(getAllCommentsByUser);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authUser'].currentValue) {
      this.store.dispatch(
        PostApiActions.fetchAllCommentsByUser({
          userId: changes['authUser'].currentValue.id,
        })
      );
    }
  }
}
