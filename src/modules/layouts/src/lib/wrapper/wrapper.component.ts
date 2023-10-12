import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PostApiActions, PostState } from 'state';

@Component({
  selector: 'feature-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit {
  constructor(private store: Store<PostState>) {}

  ngOnInit(): void {
    this.store.dispatch(PostApiActions.fetchAllPost());
  }
}
