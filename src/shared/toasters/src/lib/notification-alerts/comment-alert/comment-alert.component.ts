/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SecurityContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  Subscription,
  filter,
  fromEvent,
  switchMap,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { CommentResponseType, Notifications } from 'utils';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDistance } from 'date-fns';
import { CommentService, FormatNotificationService } from 'services';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions, PostApiActions, PostState } from 'state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-comment-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-alert.component.html',
  styleUrls: ['./comment-alert.component.scss'],
})
export class CommentAlertComponent implements OnChanges, AfterViewInit {
  @ViewChild('toastMessage') toastMessage!: ElementRef<HTMLDivElement>;

  @Input({ alias: 'notification-info', required: true })
  notification!: Notifications | null;
  showToast$ = new BehaviorSubject<boolean>(false);
  showToastObservable = this.showToast$.asObservable();
  timerCount = 10;
  fetchingComment = false;
  commentSubscription = new Subscription();

  constructor(
    private formatNotificationService: FormatNotificationService,
    private commentservice: CommentService,
    private store: Store<PostState>,
    private santizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notification'].currentValue) {
      this.showToast();
    }
  }

  ngAfterViewInit(): void {
    const timer$ = timer(0, 1000);

    const mouseEnter$ = fromEvent(
      this.toastMessage.nativeElement,
      'mouseenter'
    );
    const mouseLeave$ = fromEvent(
      this.toastMessage.nativeElement,
      'mouseleave'
    );

    mouseLeave$
      .pipe(
        filter((event) => event !== undefined && event !== null),
        switchMap(() => timer$.pipe(take(5))),
        filter((data) => data === 4)
      )
      .subscribe(() => this.hideToast());

    this.showToastObservable
      .pipe(
        filter((state) => state === true),
        switchMap(() => timer$.pipe(take(this.timerCount))),
        filter((data) => data === this.timerCount - 1),
        takeUntil(mouseEnter$)
      )
      .subscribe(() => {
        console.log('disable toast');
        this.hideToast();
      });
  }

  hideToast() {
    this.showToast$.next(false);
    this.notification = null;
  }

  showToast() {
    this.showToast$.next(true);
  }

  getTargetType(notification: Notifications) {
    return this.formatNotificationService.getTargetType(notification);
  }

  formateTime(createdAt: string) {
    return formatDistance(new Date(), new Date(createdAt), {
      includeSeconds: true,
      addSuffix: true,
    });
  }
}
