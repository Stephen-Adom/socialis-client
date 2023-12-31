import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoInternetService {
  isNotConnected$ = new BehaviorSubject<boolean>(false);

  isNotConnectedObservable = this.isNotConnected$.asObservable();

  toggleIsNotConnected(notConnected: boolean) {
    return this.isNotConnected$.next(notConnected);
  }
}
