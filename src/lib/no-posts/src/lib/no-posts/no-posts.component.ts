import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-no-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-posts.component.html',
  styleUrls: ['./no-posts.component.css'],
})
export class NoPostsComponent {}
