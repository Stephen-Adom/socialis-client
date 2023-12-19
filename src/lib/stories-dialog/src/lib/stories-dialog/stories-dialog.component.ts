import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'lib-stories-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './stories-dialog.component.html',
  styleUrls: ['./stories-dialog.component.css'],
})
export class StoriesDialogComponent {
  visible = true;
  position = 'bottom' as const;
}
