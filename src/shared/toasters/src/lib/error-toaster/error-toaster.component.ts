/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
  OnChanges,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ERROR_MESSAGE_TOKEN, ErrorMessageType } from 'utils';
import { ErrorMessageService } from 'services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-error-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toaster.component.html',
  styleUrls: ['./error-toaster.component.css'],
})
export class ErrorToasterComponent implements OnChanges, OnDestroy, OnInit {
  @Input({ required: true }) errorMessage: ErrorMessageType | null = null;

  @ViewChild('toastDanger') toastDanger!: ElementRef<HTMLDivElement>;

  setTimoutSub: any;

  errorMessageSubscription = new Subscription();

  constructor(
    @Inject(ERROR_MESSAGE_TOKEN)
    private errorMessageService: ErrorMessageService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.errorMessageSubscription =
      this.errorMessageService.errorMessageObservable.subscribe((error) => {
        console.log(error, 'error message');
        if (error) {
          this.errorMessage = error;
          // this.dismissAlertAfterSixSeconds();
        }
      });
  }

  closeNotification() {
    if (this.toastDanger.nativeElement.classList.contains('animate-normal')) {
      this.toastDanger.nativeElement.classList.replace(
        'animate-normal',
        'animate-reverse'
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errorMessage']['currentValue']) {
      this.dismissAlertAfterSixSeconds();
    }
  }

  dismissAlertAfterSixSeconds() {
    this.setTimoutSub = setTimeout(() => {
      this.errorMessage = null;
      const errorElements =
        this.document.documentElement.querySelectorAll('.toast-danger');
      if (errorElements.length) {
        errorElements.forEach((element) => {
          element.classList.replace('animate-normal', 'animate-reverse');
        });
      }
    }, 6000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.setTimoutSub);
    this.errorMessageSubscription.unsubscribe();
  }
}
