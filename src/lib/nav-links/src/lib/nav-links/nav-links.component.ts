import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-nav-links',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.css'],
})
export class NavLinksComponent {}
