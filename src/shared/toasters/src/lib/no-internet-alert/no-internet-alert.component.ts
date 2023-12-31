import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-no-internet-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-internet-alert.component.html',
  styleUrls: ['./no-internet-alert.component.scss'],
})
export class NoInternetAlertComponent {}
