/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserInfoType } from 'utils';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-profile-card-summary',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './profile-card-summary.component.html',
  styleUrls: ['./profile-card-summary.component.css'],
})
export class ProfileCardSummaryComponent implements OnInit {
  authUser$!: Observable<UserInfoType | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }
}
