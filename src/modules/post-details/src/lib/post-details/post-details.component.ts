/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommentListComponent } from 'comment-list';
import { CreateCommentFormComponent } from 'create-comment-form';
import { ActivatedRoute } from '@angular/router';
import { PostState, getPostDetails } from 'state';
import { Store } from '@ngrx/store';
import { PostType } from 'utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-post-details',
  standalone: true,
  imports: [CommonModule, CommentListComponent, CreateCommentFormComponent],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit {
  post$!: Observable<PostType | null>;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((data) => {
      console.log(data.get('id'));
    });

    this.post$ = this.store.select(getPostDetails);

    this.post$.subscribe((post) => {
      if (!post) {
      }
    });
  }

  back() {
    this.location.back();
  }
}
