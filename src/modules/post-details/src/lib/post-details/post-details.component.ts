import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommentListComponent } from 'comment-list';
import { CreateCommentFormComponent } from 'create-comment-form';

@Component({
  selector: 'lib-post-details',
  standalone: true,
  imports: [CommonModule, CommentListComponent, CreateCommentFormComponent],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent {
  constructor(private location: Location) {}

  back() {
    this.location.back();
  }
}
