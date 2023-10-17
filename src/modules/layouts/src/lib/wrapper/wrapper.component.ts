import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, first, map } from 'rxjs';
import { MessageService, PostService } from 'services';
import {
  PostApiActions,
  PostState,
  getPostDetails,
  getUserInformation,
} from 'state';

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

    this.store.select(getPostDetails).subscribe((post) => {
      if (post) {
        this.store.dispatch(
          PostApiActions.fetchPostComments({ postId: post.id })
        );
      }
    });

    this.messageservice.onMessage('/feed/chat').subscribe((data) => {
      console.log(data, 'data');
    });
    this.messageservice.onMessage('/feed/post/new').subscribe((data) => {
      if (data) {
        this.store.dispatch(PostApiActions.addNewPost({ newPost: data }));
      }
    });

    this.messageservice.onMessage('/feed/comment/new').subscribe((data) => {
      if (data) {
        this.store.dispatch(PostApiActions.addNewComment({ newComment: data }));
      }
    });

    this.messageservice.onMessage('/feed/post/update').subscribe((data) => {
      if (data) {
        this.store.dispatch(PostApiActions.updateAPost({ post: data }));
      }
    });

    this.messageservice.onMessage('/feed/comment/update').subscribe((data) => {
      if (data) {
        console.log(data, 'comment update');
        this.store.dispatch(PostApiActions.updateAComment({ comment: data }));
      }
    });

    this.messageservice.onMessage('/feed/reply/new').subscribe((data) => {
      if (data) {
        console.log(data, 'reply new');
        this.store.dispatch(PostApiActions.addNewReply({ newReply: data }));
      }
    });

    // this.postservice.fetchAllPost().subscribe((posts) => {
    //   console.log(posts);
    // });
  }
  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
