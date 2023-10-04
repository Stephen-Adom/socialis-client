import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostModalComponent } from 'new-post-modal';

@Component({
  selector: 'feature-mobile-navigation',
  standalone: true,
  imports: [CommonModule, NewPostModalComponent],
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss'],
})
export class MobileNavigationComponent {}
