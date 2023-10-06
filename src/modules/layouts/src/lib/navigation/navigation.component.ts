import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as localforage from 'localforage';
import { AppApiActions, AppState } from 'state';

@Component({
  selector: 'feature-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @ViewChild('navigation') navigation!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store<AppState>,
    private router: Router
  ) {}

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
}
