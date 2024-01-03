import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionProgressService {
  toggleSendingPostLoader$ = new BehaviorSubject<boolean>(false);

  toggleSendingPostLoaderObservable =
    this.toggleSendingPostLoader$.asObservable();

  toggleSendingPostLoader(state: boolean) {
    this.toggleSendingPostLoader$.next(state);
  }
}
