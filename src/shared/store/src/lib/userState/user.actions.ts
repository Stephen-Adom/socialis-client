/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, props } from '@ngrx/store';
import {
  AllUserSummaryResponseType,
  UserSummaryInfo,
  UserSummaryInfoResponseType,
} from 'utils';
import { emptyProps } from '@ngrx/store';

export const UserApiActions = createActionGroup({
  source: 'USER API',
  events: {
    fetchUserDetails: props<{ username: string }>(),
    fetchUserDetailsSuccess: props<{ userInfo: UserSummaryInfoResponseType }>(),
    followUser: props<{ followId: number; followingId: number }>(),
    unfollowUser: props<{ followId: number; followingId: number }>(),
    followUserSuccess: emptyProps(),
    fetchAllFollowers: props<{ username: string }>(),
    fetchAllFollowersSuccess: props<{
      usersResponse: AllUserSummaryResponseType;
    }>(),
    fetchAllFollowing: props<{ username: string }>(),
    fetchAllFollowingSuccess: props<{
      usersResponse: AllUserSummaryResponseType;
    }>(),
    updateFollowersList: props<{ user: UserSummaryInfo }>(),
    updateFollowingList: props<{ user: UserSummaryInfo }>(),
  },
});
