import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostApiActions, PostState, getAllTotalPosts } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-load-more-post-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-more-post-button.component.html',
  styleUrls: ['./load-more-post-button.component.css'],
})
export class LoadMorePostButtonComponent implements OnInit {
  @Input({ required: true }) loading!: boolean;
  @Input({ required: true }) fetchError!: boolean;
  totalPostsLength$!: Observable<number>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.totalPostsLength$ = this.store.select(getAllTotalPosts);
  }

  fetchPost() {
    this.store.dispatch(PostApiActions.toggleDataLoading({ loading: true }));

    let total = null;

    this.totalPostsLength$.subscribe((data) => (total = data));

    if (total !== null) {
      this.store.dispatch(
        PostApiActions.fetchAllPostsWithOffset({
          offset: total,
        })
      );
    }
  }
}
