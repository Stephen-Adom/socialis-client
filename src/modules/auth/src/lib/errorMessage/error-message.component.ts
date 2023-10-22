import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'feature-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input({ required: true }) errorMessage!: string;
  @Input({ required: true }) control!: string;
  @Input({ required: true }) Form!: FormGroup;
}
