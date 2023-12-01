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
  Observable,
  combineLatest,
  debounceTime,
  filter,
  fromEvent,
  interval,
  merge,
  startWith,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
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
  pointerHovering$ = new BehaviorSubject<boolean>(false);
  showToastObservable = this.showToast$.asObservable();
  pointerHoveringObservable = this.pointerHovering$.asObservable();

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

    mouseLeave$
      .pipe(
        filter((event) => event !== undefined && event !== null),
        switchMap(() => timer$.pipe(take(5)))
      )
      .subscribe(() => this.hideToast());

    this.showToastObservable
      .pipe(
        filter((state) => state === true),
        switchMap(() => timer$.pipe(take(10))),
        takeUntil(mouseEnter$)
      )
      .subscribe(() => this.hideToast());
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
