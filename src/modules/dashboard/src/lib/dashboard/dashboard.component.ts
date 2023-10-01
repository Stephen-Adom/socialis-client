import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'feature-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {}
