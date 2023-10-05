import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-error-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toaster.component.html',
  styleUrls: ['./error-toaster.component.css'],
})
export class ErrorToasterComponent {}
