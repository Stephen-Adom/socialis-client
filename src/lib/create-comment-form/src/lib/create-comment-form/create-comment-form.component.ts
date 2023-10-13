import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-create-comment-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-comment-form.component.html',
  styleUrls: ['./create-comment-form.component.css'],
})
export class CreateCommentFormComponent {}
