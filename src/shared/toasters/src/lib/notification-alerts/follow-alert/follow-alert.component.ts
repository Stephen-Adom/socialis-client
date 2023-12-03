/* eslint-disable @angular-eslint/no-input-rename */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistance } from 'date-fns';
import {
  BehaviorSubject,
  timer,
  fromEvent,
  filter,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Notifications } from 'utils';

@Component({
  selector: 'lib-follow-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './follow-alert.component.html',
  styleUrls: ['./follow-alert.component.scss'],
})
export class FollowAlertComponent implements OnChanges, AfterViewInit {
  @ViewChild('toastMessage') toastMessage!: ElementRef<HTMLDivElement>;
  @ViewChild('replyBtn') replyBtn!: ElementRef<HTMLButtonElement>;

  @Input({ alias: 'notification-info', required: true })
  notification!: Notifications | null;
  showToast$ = new BehaviorSubject<boolean>(false);
  showToastObservable = this.showToast$.asObservable();
  timerCount = 10;

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

  formateTime(createdAt: string) {
    return formatDistance(new Date(), new Date(createdAt), {
      includeSeconds: true,
      addSuffix: true,
    });
  }
}
