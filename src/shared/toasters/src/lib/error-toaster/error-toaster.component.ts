import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-error-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toaster.component.html',
  styleUrls: ['./error-toaster.component.css'],
})
export class ErrorToasterComponent {
  @ViewChild('toastDanger') toastDanger!: ElementRef<HTMLDivElement>;

  closeNotification() {
    if (this.toastDanger.nativeElement.classList.contains('animate-normal')) {
      this.toastDanger.nativeElement.classList.replace(
        'animate-normal',
        'animate-reverse'
      );
    }
  }
}
