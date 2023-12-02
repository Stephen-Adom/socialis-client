import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
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

@Component({
  selector: 'lib-mention-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mention-alert.component.html',
  styleUrls: ['./mention-alert.component.scss'],
})
export class MentionAlertComponent implements OnInit, AfterViewInit {
  @ViewChild('toastMessage') toastMessage!: ElementRef<HTMLDivElement>;
  showToast$ = new BehaviorSubject<boolean>(true);
  showToastObservable = this.showToast$.asObservable();
  timerCount = 10;

  ngOnInit(): void {
    'dfd';
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

    // mouseLeave$
    //   .pipe(
    //     filter((event) => event !== undefined && event !== null),
    //     switchMap(() => timer$.pipe(take(5))),
    //     filter((data) => data === 4)
    //   )
    //   .subscribe(() => this.hideToast());

    // this.showToastObservable
    //   .pipe(
    //     filter((state) => state === true),
    //     switchMap(() => timer$.pipe(take(this.timerCount))),
    //     filter((data) => data === this.timerCount - 1),
    //     takeUntil(mouseEnter$)
    //   )
    //   .subscribe(() => {
    //     console.log('disable toast');
    //     // this.hideToast()
    //   });
  }

  hideToast() {
    console.log('hiding toast');
    this.showToast$.next(false);
  }

  showToast() {
    console.log('showing toast');
    this.showToast$.next(true);
  }
}
