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
  filter,
  fromEvent,
  switchMap,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { Notifications } from 'utils';
import { FormatNotificationService } from 'services';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-mention-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mention-alert.component.html',
  styleUrls: ['./mention-alert.component.scss'],
})
export class MentionAlertComponent implements OnChanges, AfterViewInit {
  @ViewChild('toastMessage') toastMessage!: ElementRef<HTMLDivElement>;
  @Input({ alias: 'notification-info', required: true })
  notification!: Notifications;
  showToast$ = new BehaviorSubject<boolean>(true);
  showToastObservable = this.showToast$.asObservable();
  timerCount = 10;

  constructor(
    private formatNotificationService: FormatNotificationService,
    private santizer: DomSanitizer,
    private router: Router
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
        // this.hideToast()
      });
  }

  hideToast() {
    this.showToast$.next(false);
  }

  showToast() {
    this.showToast$.next(true);
  }

  getTargetType(notification: Notifications) {
    return this.formatNotificationService.getTargetType(notification);
  }

  santizeHTML(targetContent: string | undefined) {
    if (targetContent) {
      return targetContent.length > 35
        ? this.santizer.sanitize(
            SecurityContext.HTML,
            targetContent.slice(0, 35) + '...'
          )
        : this.santizer.sanitize(SecurityContext.HTML, targetContent);
    }

    return '';
  }

  viewContent() {
    this.router.navigate([this.notification.target.targetUrl]);
    this.hideToast();
  }
}
