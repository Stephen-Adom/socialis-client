/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllUserCommentComponent } from './all-user-comment/all-user-comment.component';
import { AllUserLikedPostsComponent } from './all-user-liked-posts/all-user-liked-posts.component';
import { AllUserPostComponent } from './all-user-post/all-user-post.component';
import { AllUserRepliesComponent } from './all-user-replies/all-user-replies.component';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { UserInfoType } from 'utils';
import { Observable } from 'rxjs';

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
export class ProfileComponent implements OnInit {
  authUser$!: Observable<UserInfoType | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }
}
