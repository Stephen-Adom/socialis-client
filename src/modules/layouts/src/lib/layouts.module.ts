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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  ActionProgressService,
  AuthenticationService,
  BookmarksService,
  CommentService,
  ConfirmDeleteService,
  DisplayAlertInfoService,
  FormatNotificationService,
  FormatPostService,
  MessageService,
  NotificationOffcanvasService,
  NotificationService,
  PostService,
  ReplyService,
  StoriesEditPreviewService,
  StoryUploadService,
  SuccessMessageService,
  UserService,
} from 'services';
import { StoreModule } from '@ngrx/store';
import {
  PostEffects,
  PostReducer,
  StoryEffects,
  StoryReducer,
  UserEffects,
  UserReducer,
  featurePostKey,
  featureStoryKey,
  featureUserKey,
} from 'state';
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
  NotificationAlertsComponent,
  SuccessNotificationComponent,
} from 'notification';
import { TooltipModule } from 'primeng/tooltip';
import { NavLinksComponent } from 'nav-links';
import { ProfileCardSummaryComponent } from 'profile-card-summary';
import { NotificationOffcanvasComponent } from 'notification-offcanvas';
import { AuthTokenInterceptorInterceptor } from 'interceptors';
import { StoriesDialogComponent } from 'stories-dialog';
import { StoriesEditPreviewComponent } from 'stories-edit-preview';
import { StoriesPreviewComponent } from 'stories-preview';

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
    StoreModule.forFeature(featureUserKey, UserReducer),
    StoreModule.forFeature(featureStoryKey, StoryReducer),
    EffectsModule.forFeature([PostEffects, UserEffects, StoryEffects]),
    CommentReplyModalComponent,
    ReplyModalFormComponent,
    AddCommentFormModalComponent,
    EditCoverBackgroundModalComponent,
    EditAuthImageModalComponent,
    EditAuthProfileModalComponent,
    ConfirmDeleteDialogComponent,
    ActionInProgressComponent,
    SuccessNotificationComponent,
    TooltipModule,
    NavLinksComponent,
    ProfileCardSummaryComponent,
    NotificationOffcanvasComponent,
    NotificationAlertsComponent,
    StoriesDialogComponent,
    StoriesEditPreviewComponent,
    StoriesPreviewComponent,
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
    NotificationOffcanvasService,
    NotificationService,
    FormatPostService,
    DisplayAlertInfoService,
    FormatNotificationService,
    StoriesEditPreviewService,
    StoryUploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptorInterceptor,
      multi: true,
    },
  ],
})
export class LayoutsModule {}
