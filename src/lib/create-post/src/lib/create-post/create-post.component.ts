import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostModalComponent } from '../new-post-modal/new-post-modal.component';

@Component({
  selector: 'lib-create-post',
  standalone: true,
  imports: [CommonModule, NewPostModalComponent],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {}
