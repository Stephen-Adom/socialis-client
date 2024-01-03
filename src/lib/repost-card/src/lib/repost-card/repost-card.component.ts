/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostState, getAllPosts } from 'state';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { PostType } from 'utils';
import { PostCardComponent } from 'post-card';

@Component({
  selector: 'lib-repost-card',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './repost-card.component.html',
  styleUrls: ['./repost-card.component.css'],
})
export class RepostCardComponent implements OnInit {
  firstPost$!: Observable<PostType>;

  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.firstPost$ = this.store
      .select(getAllPosts)
      .pipe(map((posts) => posts[0]));
  }
}
