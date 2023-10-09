import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-activate-account-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate-account-notification.component.html',
  styleUrls: ['./activate-account-notification.component.scss'],
})
export class ActivateAccountNotificationComponent implements OnInit, OnDestroy {
  @ViewChild('activateAccountNotification')
  activateAccountNotification!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) innactiveAccount!: boolean;

  accountSubscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.accountSubscription = this.store
      .select(getUserInformation)
      .subscribe((userInfo) => {
        if (userInfo && !userInfo.enabled) {
          this.innactiveAccount = true;
        }
      });
  }

  close() {
    if (
      this.activateAccountNotification.nativeElement.classList.contains(
        'animate-normal'
      )
    ) {
      this.activateAccountNotification.nativeElement.classList.replace(
        'animate-normal',
        'animate-reverse'
      );
    }
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }
}
