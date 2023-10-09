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
import { InnactiveAccountService } from 'services';

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
  innactiveAccount!: boolean;

  accountSubscription = new Subscription();

  constructor(
    private innactiveAccountService: InnactiveAccountService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.accountSubscription =
      this.innactiveAccountService.innactiveAccountObservable.subscribe(
        (data) => {
          this.innactiveAccount = data;
          console.log(this.innactiveAccount, data);
        }
      );
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
