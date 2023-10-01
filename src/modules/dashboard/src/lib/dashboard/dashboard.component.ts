import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesComponent } from 'stories';
import { PostCardComponent } from 'post-card';

@Component({
  selector: 'feature-dashboard',
  standalone: true,
  imports: [CommonModule, StoriesComponent, PostCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {}
