/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyType, SimpleUserInfoType, UserInfoType } from 'utils';
import { format } from 'date-fns';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { PostApiActions, PostState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { ConfirmDeleteService, dataDeleteObject } from 'services';

@Component({
  selector: 'lib-reply-card',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './reply-card.component.html',
  styleUrls: ['./reply-card.component.scss'],
})
export class ReplyCardComponent implements OnInit {
  @Input({ required: true }) reply!: ReplyType;

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  authUser$!: Observable<UserInfoType | null>;

  likedReply$ = new BehaviorSubject<boolean>(false);
  bookmarked$ = new BehaviorSubject<boolean>(false);

  constructor(
    private confirmDeleteService: ConfirmDeleteService,
    private store: Store<PostState>
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.checkIfLiked();
    this.checkIfBookmarked();
  }

  formateDate(createdAt: string) {
    return format(new Date(createdAt), 'MMM do, yyyy');
  }

  formateTime(createdAt: string) {
    return format(new Date(createdAt), 'h:mmaaa');
  }

  getSubHtml(user: SimpleUserInfoType) {
    return `<h4>Photo Uploaded by - <a href='javascript:;' >${user.firstname} ${
      user.lastname
    }(${user.username}) </a></h4> <p> About - ${
      user.bio ? user.bio : 'Not Available!'
    }</p>`;
  }

  checkIfBookmarked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const bookmarked = this.reply.bookmarkedUsers.includes(authUser.id);

        bookmarked ? this.bookmarked$.next(true) : this.bookmarked$.next(false);

        return;
      }
      this.bookmarked$.next(false);
    });
  }

  checkIfLiked() {
    this.authUser$.subscribe((authUser) => {
      if (authUser) {
        const likedComment = this.reply.likes.find(
          (like) => like.username === authUser.username
        );

        likedComment
          ? this.likedReply$.next(true)
          : this.likedReply$.next(false);
      } else {
        this.likedReply$.next(false);
      }
    });
  }

  toggleLike() {
    combineLatest([this.authUser$, this.likedReply$]).subscribe(
      ([authuser, likedReply]) => {
        if (authuser) {
          this.store.dispatch(
            PostApiActions.toggleReplyLike({
              reply: this.reply,
              authuser,
              isLiked: likedReply,
            })
          );
        }
      }
    );
  }

  isAuth(author: string, authUser: UserInfoType | null) {
    return author === authUser?.username;
  }

  editReply(reply: ReplyType) {
    this.store.dispatch(PostApiActions.editReply({ reply }));
  }

  deleteReply(reply: ReplyType) {
    const data: dataDeleteObject = {
      data: reply.id,
      type: 'reply',
    };
    this.confirmDeleteService.deletePost(data);
  }

  toggleBookmark() {
    this.authUser$.subscribe((user) => {
      if (user) {
        this.store.dispatch(
          PostApiActions.toggleBookmarkReplies({
            reply: this.reply,
            userId: user.id,
          })
        );
      }
    });
  }
}
