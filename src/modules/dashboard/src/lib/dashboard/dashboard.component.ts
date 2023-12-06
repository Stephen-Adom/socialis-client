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
import { PostState, getAllPosts } from 'state';
import { Store } from '@ngrx/store';
import { Observable, filter, fromEvent } from 'rxjs';
import { PostType } from 'utils';
import { EventCardSummaryComponent } from 'event-card-summary';

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
  ],
  providers: [AuthenticationService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('dashboardSection') dashboardSection!: ElementRef<HTMLDivElement>;
  allPosts$!: Observable<PostType[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allPosts$ = this.store.select(getAllPosts);
  }

  ngAfterViewInit(): void {
    console.log(window.location.pathname);

    fromEvent(window, 'scroll')
      .pipe(
        // switchMap(() => this.store.select(getAllPosts)),
        // tap((posts) => console.log(posts))
        filter(
          () =>
            window.location.pathname === '/feeds' &&
            window.innerHeight + window.scrollY >=
              document.body.scrollHeight - 1
        )
      )
      .subscribe((event) => {
        console.log(event, 'event');
      });
  }
}
