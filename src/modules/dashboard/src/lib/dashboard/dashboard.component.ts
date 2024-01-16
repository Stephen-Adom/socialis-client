/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesComponent } from 'stories';
import { PostCardComponent } from 'post-card';
import { ActivityCardComponent } from 'activity-card';
import { MessagePanelComponent } from 'message-panel';
import { AuthenticationService } from 'services';
import {
  PostApiActions,
  PostState,
  getAllPosts,
  getAllTotalPosts,
  getDataLoadingState,
  getFetchPostErrorStatus,
} from 'state';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subscription,
  filter,
  fromEvent,
  throttleTime,
} from 'rxjs';
import { PostType } from 'utils';
import { EventCardSummaryComponent } from 'event-card-summary';
import { InfiniteScrollingPageLoaderComponent } from 'infinite-scrolling-page-loader';
import { RepostCardComponent } from 'repost-card';
import { LoadMorePostButtonComponent } from 'load-more-post-button';

@Component({
  selector: 'feature-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StoriesComponent,
    PostCardComponent,
    ActivityCardComponent,
    MessagePanelComponent,
    EventCardSummaryComponent,
    InfiniteScrollingPageLoaderComponent,
    RepostCardComponent,
    LoadMorePostButtonComponent,
  ],
  providers: [AuthenticationService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('dashboardSection') dashboardSection!: ElementRef<HTMLDivElement>;
  allPosts$!: Observable<PostType[]>;
  dataLoading$!: Observable<boolean>;
  allPostsSubscription = new Subscription();
  totalPostsAvailable = 0;
  totalPostsLength$!: Observable<number>;
  fetchPostError$!: Observable<boolean>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allPosts$ = this.store.select(getAllPosts);
    this.dataLoading$ = this.store.select(getDataLoadingState);

    this.totalPostsLength$ = this.store.select(getAllTotalPosts);

    this.fetchPostError$ = this.store.select(getFetchPostErrorStatus);

    this.totalPostsLength$.subscribe((total) => {
      if (total === 0) {
        console.log('no post available yet');
        this.store.dispatch(
          PostApiActions.fetchAllPostsWithOffset({ offset: total })
        );
      }
    });
  }

  ngAfterViewInit(): void {
    fromEvent(window, 'scroll')
      .pipe(
        filter(
          () =>
            window.location.pathname === '/feeds' &&
            window.innerHeight + window.scrollY >=
              document.body.scrollHeight - 1
        ),
        throttleTime(1000)
      )
      .subscribe((event) => {
        console.log(event, 'event');
        console.log(
          window.innerHeight + window.scrollY,
          document.body.scrollHeight,
          'event'
        );
        this.store.dispatch(
          PostApiActions.toggleDataLoading({ loading: true })
        );

        let total = null;

        this.totalPostsLength$.subscribe((data) => (total = data));

        if (total !== null) {
          this.store.dispatch(
            PostApiActions.fetchAllPostsWithOffset({
              offset: total,
            })
          );
        }

        // console.log(total, 'event');
      });
  }
}
