import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-new-post-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-post-modal.component.html',
  styleUrls: ['./new-post-modal.component.scss'],
})
export class NewPostModalComponent {}
