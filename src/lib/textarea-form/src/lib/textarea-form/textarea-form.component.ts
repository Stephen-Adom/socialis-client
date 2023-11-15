import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MentionConfig, MentionModule } from 'angular-mentions';
import { format } from 'date-fns';
import { AppState, getAllAuthUserFollowing } from 'state';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';

type userMentionType = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  imageUrl: string;
  totalPost: number;
  followers: number;
  following: number;
  createdAt: string;
};

@Component({
  selector: 'lib-textarea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MentionModule],
  templateUrl: './textarea-form.component.html',
  styleUrls: ['./textarea-form.component.css'],
})
export class TextareaFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) Form!: FormGroup;
  mentionConfig!: MentionConfig;
  authUserFollowingSubscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authUserFollowingSubscription = this.store
      .select(getAllAuthUserFollowing)
      .pipe(
        map((allfollowings) => {
          return allfollowings.map((following) => {
            return {
              id: following.id,
              firstname: following.firstname,
              lastname: following.lastname,
              username: following.username,
              imageUrl: following.imageUrl,
              totalPost: following.totalPost,
              followers: following.followers,
              following: following.following,
              createdAt: following.createdAt,
            };
          });
        })
      )
      .subscribe((users) => {
        this.mentionConfig = {
          triggerChar: '@',
          labelKey: 'username',
          allowSpace: true,
          items: users,
          mentionSelect: (item: userMentionType, triggerChar?: string) =>
            triggerChar + item.username + ' ',
          mentionFilter: (searchString: string, items: userMentionType[]) => {
            console.log(searchString, 'sdf');
            if (searchString) {
              return items.filter((item: userMentionType) =>
                item.username.toLowerCase().includes(searchString)
              );
            }

            return items;
          },
        };
      });
  }

  handleKeyDown(event: KeyboardEvent) {
    console.log(event);
  }

  formatCreatedAt(createdAt: string) {
    return format(new Date(createdAt), 'MMMM, yyyy');
  }

  ngOnDestroy(): void {
    this.authUserFollowingSubscription.unsubscribe();
  }
}
