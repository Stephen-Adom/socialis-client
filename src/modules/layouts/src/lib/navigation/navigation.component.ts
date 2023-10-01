import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'feature-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @ViewChild('navigation') navigation!: ElementRef<HTMLDivElement>;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.document.documentElement.scrollTop > 75) {
      this.navigation.nativeElement.classList.add('sticky');
    } else {
      this.navigation.nativeElement.classList.remove('sticky');
    }
  }
}
