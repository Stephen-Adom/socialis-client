import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLinksComponent } from 'nav-links';

@Component({
  selector: 'lib-create-post',
  standalone: true,
  imports: [CommonModule, NavLinksComponent],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {}
