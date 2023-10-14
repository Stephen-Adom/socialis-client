import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MessageService } from 'services';
import { PostApiActions, PostState, getUserInformation } from 'state';

@Component({
  selector: 'feature-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit, OnDestroy {
  userInfoSubscription = new Subscription();

  constructor(
    private messageservice: MessageService,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    // this.store.select(getUserInformation).subscribe((userInfo) => {
    //   if (userInfo) {
    //     this.store.dispatch(
    //       PostApiActions.fetchAllPost({ userId: userInfo.id })
    //     );
    //   }
    // });
    this.messageservice.connect().subscribe(() => {
      this.messageservice.send('/app/chat', { content: 'testing message' });
    });

    this.messageservice.onMessage('/topic/messages').subscribe((data) => {
      console.log(data, 'data');
    });
  }
  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
