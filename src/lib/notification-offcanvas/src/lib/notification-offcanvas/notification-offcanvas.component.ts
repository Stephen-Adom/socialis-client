import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationOffcanvasService } from 'services';
import { SidebarModule } from 'primeng/sidebar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-notification-offcanvas',
  standalone: true,
  imports: [CommonModule, SidebarModule],
  templateUrl: './notification-offcanvas.component.html',
  styleUrls: ['./notification-offcanvas.component.css'],
})
export class NotificationOffcanvasComponent implements OnInit, OnDestroy {
  sidebarVisible!: boolean;
  offcanvasSubscription = new Subscription();

  constructor(private offcanvasService: NotificationOffcanvasService) {}

  ngOnInit(): void {
    this.offcanvasSubscription =
      this.offcanvasService.toggleOffcanvasVisibilityObservable.subscribe(
        (state) => {
          this.sidebarVisible = state;
        }
      );
  }

  onHide() {
    this.offcanvasService.toggleOffcanvas(false);
  }

  ngOnDestroy(): void {
    this.offcanvasSubscription.unsubscribe();
  }
}
