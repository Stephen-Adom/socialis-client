import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuccessMessageService {
  successMessage$ = new BehaviorSubject<string>('');
  successMessageObservable = this.successMessage$.asObservable();

  sendSuccessMessage(message: string) {
    console.log(message, 'success message');
    this.successMessage$.next(message);
  }
}
