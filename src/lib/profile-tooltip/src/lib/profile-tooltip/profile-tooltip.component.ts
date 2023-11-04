/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSummaryInfo } from 'utils';

@Component({
  selector: 'lib-profile-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-tooltip.component.html',
  styleUrls: ['./profile-tooltip.component.css'],
})
export class ProfileTooltipComponent {
  authorInfo!: UserSummaryInfo;
}
