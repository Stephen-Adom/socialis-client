/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommentListComponent } from 'comment-list';
import { CreateCommentFormComponent } from 'create-comment-form';
import { ActivatedRoute } from '@angular/router';
import { PostApiActions, PostState, getPostDetails } from 'state';
import { Store } from '@ngrx/store';
import { PostType } from 'utils';
import { Observable, Subscription } from 'rxjs';
import { format } from 'date-fns';

@Component({
  selector: 'lib-post-details',
  standalone: true,
  imports: [CommonModule, CommentListComponent, CreateCommentFormComponent],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  post$!: Observable<PostType | null>;
  postId!: number;
  postSubscription = new Subscription();
  routeSubscription = new Subscription();

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((data) => {
      this.postId = parseInt(data.get('id')!);
    });

    this.post$ = this.store.select(getPostDetails);

    this.postSubscription = this.post$.subscribe((post) => {
      if (!post) {
        this.store.dispatch(
          PostApiActions.fetchPostById({ postId: this.postId })
        );
      }
    });
  }

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
