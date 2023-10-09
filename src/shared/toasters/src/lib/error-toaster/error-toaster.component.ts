import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
  OnChanges,
  Inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ErrorMessageType } from 'utils';

@Component({
  selector: 'lib-error-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toaster.component.html',
  styleUrls: ['./error-toaster.component.css'],
})
export class ErrorToasterComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) errorMessage: ErrorMessageType | null = null;

  @ViewChild('toastDanger') toastDanger!: ElementRef<HTMLDivElement>;

  setTimoutSub: any;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  closeNotification() {
    if (this.toastDanger.nativeElement.classList.contains('animate-normal')) {
      this.toastDanger.nativeElement.classList.replace(
        'animate-normal',
        'animate-reverse'
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, 'changes');
    if (changes['errorMessage']['currentValue']) {
      this.dismissAlertAfterEightSeconds();
    }
  }

  dismissAlertAfterEightSeconds() {
    this.setTimoutSub = setTimeout(() => {
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
  }
}
