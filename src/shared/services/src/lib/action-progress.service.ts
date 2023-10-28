import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionProgressService {
  toggleAction$ = new BehaviorSubject<boolean>(false);

  toggleActionObservable = this.toggleAction$.asObservable();

  toggleActionInProgress(state: boolean) {
    this.toggleAction$.next(state);
  }
}
