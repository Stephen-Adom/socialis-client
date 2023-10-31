/* eslint-disable @nx/enforce-module-boundaries */
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
import { HttpClientModule } from '@angular/common/http';
import {
  ActionProgressService,
  AuthenticationService,
  BookmarksService,
  CommentService,
  ConfirmDeleteService,
  MessageService,
  PostService,
  ReplyService,
  SuccessMessageService,
  UserService,
} from 'services';
import { StoreModule } from '@ngrx/store';
import { PostEffects, PostReducer, featurePostKey } from 'state';
import { EffectsModule } from '@ngrx/effects';
import { CommentReplyModalComponent } from 'comment-reply-modal';
import { ReplyModalFormComponent } from 'reply-modal-form';
import { AddCommentFormModalComponent } from 'add-comment-form-modal';
import { EditCoverBackgroundModalComponent } from 'edit-cover-background-modal';
import { EditAuthImageModalComponent } from 'edit-auth-image-modal';
import { EditAuthProfileModalComponent } from 'edit-auth-profile-modal';
import { ConfirmDeleteDialogComponent } from 'confirm-delete-dialog';
import {
  ActionInProgressComponent,
  SuccessNotificationComponent,
} from 'notification';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(layoutsRoutes),
    CreatePostComponent,
    FollowersComponent,
    MobileNavigationComponent,
    NewPostModalComponent,
    SearchModalComponent,
    HttpClientModule,
    StoreModule.forFeature(featurePostKey, PostReducer),
    EffectsModule.forFeature([PostEffects]),
    CommentReplyModalComponent,
    ReplyModalFormComponent,
    AddCommentFormModalComponent,
    EditCoverBackgroundModalComponent,
    EditAuthImageModalComponent,
    EditAuthProfileModalComponent,
    ConfirmDeleteDialogComponent,
    ActionInProgressComponent,
    SuccessNotificationComponent,
  ],
  declarations: [NavigationComponent, WrapperComponent],
  providers: [
    AuthenticationService,
    PostService,
    MessageService,
    CommentService,
    ReplyService,
    UserService,
    ConfirmDeleteService,
    ActionProgressService,
    BookmarksService,
    SuccessMessageService,
  ],
})
export class LayoutsModule {}
