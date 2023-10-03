import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from 'comment-list';

@Component({
  selector: 'lib-post-details',
  standalone: true,
  imports: [CommonModule, CommentListComponent],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent {}
