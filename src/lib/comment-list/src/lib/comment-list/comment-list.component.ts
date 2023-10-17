/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { PostState, getAllCommentForAPost } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommentType } from 'utils';

@Component({
  selector: 'lib-comment-list',
  standalone: true,
  imports: [CommonModule, CommentCardComponent],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
})
export class CommentListComponent implements OnInit {
  allComments$!: Observable<CommentType[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allComments$ = this.store.select(getAllCommentForAPost);
  }
}
