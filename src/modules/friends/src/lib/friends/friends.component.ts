import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { UserFollowersComponent } from './user-followers/user-followers.component';

@Component({
  selector: 'lib-friends',
  standalone: true,
  imports: [CommonModule, TabViewModule, UserFollowersComponent],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  activeIndex = 0;
}
