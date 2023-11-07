/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostType, UserInfoType, UserSummaryInfoFollowing } from 'utils';
import { Observable } from 'rxjs';
import { PostCardComponent } from 'post-card';
import { NoPostsComponent } from 'no-posts';
import { PostApiActions, PostState, getAllPostsByUser } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-all-user-post',
  standalone: true,
  imports: [CommonModule, PostCardComponent, NoPostsComponent],
  templateUrl: './all-user-post.component.html',
  styleUrls: ['./all-user-post.component.scss'],
})
export class AllUserPostComponent implements OnInit, OnChanges {
  @Input({ required: true }) authUser!:
    | UserInfoType
    | UserSummaryInfoFollowing
    | null;
  allPosts$!: Observable<PostType[]>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.allPosts$ = this.store.select(getAllPostsByUser);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authUser'].currentValue) {
      this.store.dispatch(
        PostApiActions.fetchAllPostsByUser({
          userId: changes['authUser'].currentValue.id,
        })
      );
    }
  }
}
