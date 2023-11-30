/* eslint-disable @nx/enforce-module-boundaries */
import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as localforage from 'localforage';
import { Observable, Subscription, tap } from 'rxjs';
import {
  AppApiActions,
  AppState,
  UserApiActions,
  getUnreadNotificationTotalCount,
  getUserInformation,
} from 'state';
import { UserInfoType } from 'utils';
import { OnInit } from '@angular/core';
import { NotificationOffcanvasService } from 'services';

@Component({
  selector: 'feature-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('navigation') navigation!: ElementRef<HTMLDivElement>;
  authUser$!: Observable<UserInfoType | null>;
  notificationOffcanvasState!: boolean;
  notificationOffcanvasSubscription = new Subscription();
  unreadNotificationCount$!: Observable<number>;

  constructor(
    private offcanvasService: NotificationOffcanvasService,
    @Inject(DOCUMENT) private document: Document,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationOffcanvasSubscription =
      this.offcanvasService.toggleOffcanvasVisibilityObservable.subscribe(
        (state) => (this.notificationOffcanvasState = state)
      );
    this.authUser$ = this.store.select(getUserInformation).pipe(
      tap((authUser) => {
        if (authUser) {
          this.store.dispatch(
            UserApiActions.fetchUnreadNotificationCount({ userId: authUser.id })
          );
        }
      })
    );

    this.unreadNotificationCount$ = this.store.select(
      getUnreadNotificationTotalCount
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.document.documentElement.scrollTop > 75) {
      this.navigation.nativeElement.classList.add('sticky');
    } else {
      this.navigation.nativeElement.classList.remove('sticky');
    }
  }

  async signOut() {
    try {
      this.store.dispatch(AppApiActions.clearUserAuthInfo());
      await localforage.removeItem('accessToken');
      await localforage.removeItem('refreshToken');
      await localforage.removeItem('userInfo');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.log(error);
    }
  }

  truncateEmailLength(email: string) {
    return email.length >= 25 ? email.substring(0, 25) + '...' : email;
  }

  toggleNotificationOffcanvas() {
    this.offcanvasService.toggleOffcanvas(!this.notificationOffcanvasState);
  }

  ngOnDestroy(): void {
    this.notificationOffcanvasSubscription.unsubscribe();
  }
}
