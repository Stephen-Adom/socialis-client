/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notifications } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class DisplayAlertInfoService {
  alertInfo$ = new BehaviorSubject<Notifications | null>(null);

  alertInfoObservable = this.alertInfo$.asObservable();

  sendAlertInfo(alert: Notifications) {
    this.alertInfo$.next(alert);
  }
}
