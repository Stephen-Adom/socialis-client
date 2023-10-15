import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, first, map } from 'rxjs';
import { MessageService, PostService } from 'services';
import { PostApiActions, PostState, getUserInformation } from 'state';

@Component({
  selector: 'feature-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit, OnDestroy {
  userInfoSubscription = new Subscription();

  constructor(
    private postservice: PostService,
    private messageservice: MessageService,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(PostApiActions.fetchAllPost());
    // this.messageservice.send('/feed/chat', { content: 'message content' });

    this.messageservice.onMessage('/feed/chat').subscribe((data) => {
      console.log(data, 'data');
    });
    this.messageservice.onMessage('/feed/posts').subscribe((data) => {
      console.log(data, 'data posts');
    });

    // this.postservice.fetchAllPost().subscribe((posts) => {
    //   console.log(posts);
    // });
  }
  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
