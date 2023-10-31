import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostState, getTotalBookmarks } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-nav-links',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.css'],
})
export class NavLinksComponent implements OnInit {
  totalBookmarks$!: Observable<number>;

  constructor(private Store: Store<PostState>) {}

  ngOnInit(): void {
    this.totalBookmarks$ = this.Store.select(getTotalBookmarks);
  }
}
