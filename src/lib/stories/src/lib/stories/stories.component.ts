import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent {}
