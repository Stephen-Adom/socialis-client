/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSummaryInfo } from 'utils';

@Component({
  selector: 'lib-friend-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.css'],
})
export class FriendCardComponent {
  @Input({ required: true }) user!: UserSummaryInfo;
  @Input({ required: true }) type!: string;
}
