/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, props } from '@ngrx/store';
import { UserInfoSummaryType } from 'utils';

export const UserApiActions = createActionGroup({
  source: 'USER API',
  events: {
    fetchUserDetails: props<{ username: string }>(),
    fetchUserDetailsSuccess: props<{ userInfo: UserInfoSummaryType }>(),
  },
});
