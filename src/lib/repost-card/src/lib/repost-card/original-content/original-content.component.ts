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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormatPostService } from 'services';
import { PostState, getAllAuthUserFollowers, getUserInformation } from 'state';
import { formatDistanceToNow } from 'date-fns';
import { MediaInfoComponent } from 'media-info';

@Component({
  selector: 'lib-original-content',
  standalone: true,
  imports: [CommonModule, MediaInfoComponent],
  templateUrl: './original-content.component.html',
  styleUrls: ['./original-content.component.css'],
})
export class OriginalContentComponent
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
  }

  ngAfterViewInit(): void {
    this.formatPostContent(this.post.content);
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
}
