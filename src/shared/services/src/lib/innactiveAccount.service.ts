import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InnactiveAccountService {
  innactiveAccount$ = new BehaviorSubject<boolean>(false);

  innactiveAccountObservable = this.innactiveAccount$.asObservable();

  accountIsNotActive(state: boolean) {
    this.innactiveAccount$.next(state);
  }
}
