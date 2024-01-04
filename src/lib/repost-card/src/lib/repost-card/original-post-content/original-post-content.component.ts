/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PostType,
  SimpleUserInfoType,
  UserInfoType,
  UserSummaryInfo,
} from 'utils';
import { ProfileTooltipDirective } from 'directives';
import { PostState, getAllAuthUserFollowers, getUserInformation } from 'state';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormatPostService } from 'services';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { formatDistanceToNow } from 'date-fns';
import { MediaInfoComponent } from 'media-info';

@Component({
  selector: 'lib-original-post-content',
  standalone: true,
  imports: [CommonModule, ProfileTooltipDirective, MediaInfoComponent],
  templateUrl: './original-post-content.component.html',
  styleUrls: ['./original-post-content.component.scss'],
})
export class OriginalPostContentComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input({ required: true }) post!: PostType;
  authUser$!: Observable<UserInfoType | null>;
  authorDetailSubscription: Subscription | undefined;
  authorIsFollowing$ = new BehaviorSubject<boolean>(false);
  authFollowers$!: Observable<UserSummaryInfo[]>;
  formattedDate!: string;
  formattedText: string | null = null;

  constructor(
    private formatPost: FormatPostService,
    private cdr: ChangeDetectorRef,
    private store: Store<PostState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
    this.authFollowers$ = this.store.select(getAllAuthUserFollowers);
    this.checkIfAuthorIsFollowing();
  }

  viewAuthorDetails(user: SimpleUserInfoType) {
    this.authorDetailSubscription = this.authUser$.subscribe((authUser) => {
      if (authUser?.username === user.username) {
        this.router.navigate(['profile']);
      } else {
        this.router.navigate(['user', user.username, 'profile']);
      }

      this.authorDetailSubscription?.unsubscribe();
    });
  }

  checkIfAuthorIsFollowing() {
    this.authFollowers$.subscribe((followers) => {
      const userExist = followers.find(
        (follower) => follower.username === this.post.user.username
      );
      userExist
        ? this.authorIsFollowing$.next(true)
        : this.authorIsFollowing$.next(false);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'].currentValue) {
      this.formattedDate = formatDistanceToNow(new Date(this.post.createdAt), {
        includeSeconds: true,
      });
    }
  }

  formatPostContent(content: string) {
    this.formattedText = this.formatPost.formatPostContent(content);
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.formatPostContent(this.post.content);
  }
}
