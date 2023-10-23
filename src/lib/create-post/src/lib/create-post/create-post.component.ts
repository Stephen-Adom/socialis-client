/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinksComponent } from 'nav-links';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserInfoType } from 'utils';

@Component({
  selector: 'lib-create-post',
  standalone: true,
  imports: [CommonModule, NavLinksComponent],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  authUser$!: Observable<UserInfoType | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }
}
