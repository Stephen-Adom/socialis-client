import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { layoutsRoutes } from './lib.routes';
import { NavigationComponent } from './navigation/navigation.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { CreatePostComponent } from 'create-post';
import { FollowersComponent } from 'followers';
import { MobileNavigationComponent } from './mobile-navigation/mobile-navigation.component';
import { NewPostModalComponent } from 'new-post-modal';
import { SearchModalComponent } from 'search-modal';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(layoutsRoutes),
    CreatePostComponent,
    FollowersComponent,
    MobileNavigationComponent,
    NewPostModalComponent,
    SearchModalComponent,
  ],
  declarations: [NavigationComponent, WrapperComponent],
})
export class LayoutsModule {}
