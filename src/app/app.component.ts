import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ErrorToasterComponent } from 'notification';
import { Subscription } from 'rxjs';
import { AppState, getErrorMessage } from 'state';
import { ErrorMessageType } from 'utils';

@Component({
  standalone: true,
  imports: [RouterModule, ErrorToasterComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  errorMessageSubscription = new Subscription();
  errorMessage: ErrorMessageType | null = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.errorMessageSubscription = this.store
      .select(getErrorMessage)
      .subscribe((data: ErrorMessageType | null) => {
        if (data) {
          this.errorMessage = data;
        }
      });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe;
  }
}
