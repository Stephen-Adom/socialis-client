import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-infinite-scrolling-page-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-scrolling-page-loader.component.html',
  styleUrls: ['./infinite-scrolling-page-loader.component.css'],
})
export class InfiniteScrollingPageLoaderComponent {
  @Input({ required: true }) loading!: boolean;
  @Input({ required: true }) fetchError!: boolean;
}
