import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionProgressService {
  toggleAction$ = new BehaviorSubject<boolean>(false);
  toggleSendingPostLoader$ = new BehaviorSubject<boolean>(false);

  toggleActionObservable = this.toggleAction$.asObservable();
  toggleSendingPostLoaderObservable =
    this.toggleSendingPostLoader$.asObservable();

  toggleActionInProgress(state: boolean) {
    this.toggleAction$.next(state);
  }

  toggleSendingPostLoader(state: boolean) {
    this.toggleSendingPostLoader$.next(state);
  }
}
