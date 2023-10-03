import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  selector: 'lib-comment-list',
  standalone: true,
  imports: [CommonModule, CommentCardComponent],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
})
export class CommentListComponent {}
