import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllUserCommentComponent } from './all-user-comment/all-user-comment.component';
import { AllUserLikedPostsComponent } from './all-user-liked-posts/all-user-liked-posts.component';
import { AllUserPostComponent } from './all-user-post/all-user-post.component';
import { AllUserRepliesComponent } from './all-user-replies/all-user-replies.component';

@Component({
  selector: 'lib-profile',
  standalone: true,
  imports: [
    CommonModule,
    AllUserPostComponent,
    AllUserRepliesComponent,
    AllUserLikedPostsComponent,
    AllUserCommentComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {}
