/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostType } from 'utils';

@Component({
  selector: 'lib-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent {
  @Input({ required: true }) post!: PostType;

  constructor(private router: Router) {}

  viewPostDetails() {
    this.router.navigate(['/maria.wanner/details/221232323']);
  }
}
