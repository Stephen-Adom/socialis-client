import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { UserFollowersComponent } from './user-followers/user-followers.component';
import { UserFollowingComponent } from './user-following/user-following.component';

@Component({
  selector: 'lib-friends',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    UserFollowersComponent,
    UserFollowingComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  activeIndex = 0;
}
