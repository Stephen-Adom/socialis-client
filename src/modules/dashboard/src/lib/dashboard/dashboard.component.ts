/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesComponent } from 'stories';
import { PostCardComponent } from 'post-card';
import { ActivityCardComponent } from 'activity-card';
import { MessagePanelComponent } from 'message-panel';
import { AuthenticationService } from 'services';
import { PostState, getAllPosts } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
export class DashboardComponent implements OnInit {
  allPosts$!: Observable<PostType[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allPosts$ = this.store.select(getAllPosts);
  }
}
