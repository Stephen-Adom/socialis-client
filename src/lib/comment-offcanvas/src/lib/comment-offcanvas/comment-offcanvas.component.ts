/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCommentFormComponent } from 'create-comment-form';
import { CommentListComponent } from 'comment-list';
import { PostApiActions, PostState, getPostDetails } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PostType } from 'utils';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'lib-comment-offcanvas',
  standalone: true,
  imports: [CommonModule, CreateCommentFormComponent, CommentListComponent],
  templateUrl: './comment-offcanvas.component.html',
  styleUrls: ['./comment-offcanvas.component.css'],
})
export class CommentOffcanvasComponent implements OnInit {
  post$!: Observable<PostType | null>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.post$ = this.store.select(getPostDetails);
  }

  formatPostDate(post: PostType) {
    return formatDistanceToNow(new Date(post.createdAt), {
      includeSeconds: true,
    });
  }

  closeCommentPanel() {
    this.store.dispatch(PostApiActions.clearPostDetails());
  }
}
