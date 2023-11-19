import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationOffcanvasService {
  toggleOffcanvasVisibility$ = new BehaviorSubject<boolean>(false);

  toggleOffcanvasVisibilityObservable =
    this.toggleOffcanvasVisibility$.asObservable();

  toggleOffcanvas(state: boolean) {
    this.toggleOffcanvasVisibility$.next(state);
  }
}
