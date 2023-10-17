/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ErrorMessageType } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  errorMessage$ = new BehaviorSubject<ErrorMessageType | null>(null);

  errorMessageObservable = this.errorMessage$.asObservable();

  sendErrorMessage(error: ErrorMessageType) {
    this.errorMessage$.next(error);
  }
}
