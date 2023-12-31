/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ErrorMessageType, UserInfoType } from 'utils';

export const AppApiActions = createActionGroup({
  source: 'App API',
  events: {
    displayErrorMessage: props<{ error: ErrorMessageType }>(),
    storeUserAuthInfo: props<{
      userInfo: UserInfoType;
      accessToken: string;
      refreshToken: string;
    }>(),
    clearUserAuthInfo: emptyProps(),
    updateUserInfo: props<{ userInfo: UserInfoType }>(),
    uploadingStory: props<{ uploading: boolean }>(),
  },
});
