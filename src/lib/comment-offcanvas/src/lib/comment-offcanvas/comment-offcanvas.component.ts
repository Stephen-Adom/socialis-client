import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCommentFormComponent } from 'create-comment-form';
import { CommentListComponent } from 'comment-list';

@Component({
  selector: 'lib-comment-offcanvas',
  standalone: true,
  imports: [CommonModule, CreateCommentFormComponent, CommentListComponent],
  templateUrl: './comment-offcanvas.component.html',
  styleUrls: ['./comment-offcanvas.component.css'],
})
export class CommentOffcanvasComponent {}
