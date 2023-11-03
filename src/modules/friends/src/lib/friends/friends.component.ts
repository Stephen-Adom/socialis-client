import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'lib-friends',
  standalone: true,
  imports: [CommonModule, TabViewModule],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  activeIndex = 0;
}
