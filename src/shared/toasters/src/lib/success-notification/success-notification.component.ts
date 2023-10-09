import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessMessageService } from 'services';
import { SUCCESS_MESSAGE_TOKEN } from 'utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-success-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-notification.component.html',
  styleUrls: ['./success-notification.component.scss'],
})
export class SuccessNotificationComponent implements OnInit, OnDestroy {
  @ViewChild('successMessageNotification')
  successMessageNotification!: ElementRef<HTMLDivElement>;
  successMessage!: string;
  messageSubscription = new Subscription();
  setTimoutSub: any;

  constructor(
    @Inject(SUCCESS_MESSAGE_TOKEN)
    private successMessageService: SuccessMessageService
  ) {}

  ngOnInit(): void {
    this.messageSubscription =
      this.successMessageService.successMessageObservable.subscribe(
        (data: string) => {
          if (data) {
            this.successMessage = data;
            this.dismissAlertAfterSixSeconds();
          }
        }
      );
  }

  dismissAlertAfterSixSeconds() {
    this.setTimoutSub = setTimeout(() => {
      this.successMessageNotification.nativeElement.classList.replace(
        'animate-normal',
        'animate-reverse'
      );
    }, 6000);
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    clearTimeout(this.setTimoutSub);
  }
}
