/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostType } from 'utils';
import { Observable } from 'rxjs';
import { PostCardComponent } from 'post-card';
import { NoPostsComponent } from 'no-posts';

@Component({
  selector: 'lib-all-user-post',
  standalone: true,
  imports: [CommonModule, PostCardComponent, NoPostsComponent],
  templateUrl: './all-user-post.component.html',
  styleUrls: ['./all-user-post.component.scss'],
})
export class AllUserPostComponent {
  allPosts$!: Observable<PostType[]>;
}
