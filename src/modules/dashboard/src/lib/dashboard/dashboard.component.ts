import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesComponent } from 'stories';
import { PostCardComponent } from 'post-card';
import { ActivityCardComponent } from 'activity-card';
import { CreatePostComponent } from 'create-post';

@Component({
  selector: 'feature-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StoriesComponent,
    PostCardComponent,
    ActivityCardComponent,
    CreatePostComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {}
