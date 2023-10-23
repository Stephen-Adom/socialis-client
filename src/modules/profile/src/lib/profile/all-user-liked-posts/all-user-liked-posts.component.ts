/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PostType } from 'utils';
import { PostCardComponent } from 'post-card';

@Component({
  selector: 'lib-all-user-liked-posts',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './all-user-liked-posts.component.html',
  styleUrls: ['./all-user-liked-posts.component.scss'],
})
export class AllUserLikedPostsComponent {
  allPosts$!: Observable<PostType[]>;
}
