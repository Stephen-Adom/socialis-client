/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, props } from '@ngrx/store';
import {
  AllNotificationsResponseType,
  AllUserSummaryInfoResponseType,
  UserSummaryInfoFollowing,
  UserSummaryInfoResponseType,
} from 'utils';
import { emptyProps } from '@ngrx/store';

export const UserApiActions = createActionGroup({
  source: 'USER API',
  events: {
    fetchUserDetails: props<{ username: string }>(),
    fetchUserDetailsSuccess: props<{ userInfo: UserSummaryInfoResponseType }>(),
    followUser: props<{ followId: number; followingId: number }>(),
    // unfollowUser: props<{ followId: number; followingId: number }>(),
    followUserSuccess: emptyProps(),
    fetchAllFollowers: props<{ username: string }>(),
    fetchAllFollowersSuccess: props<{
      usersResponse: AllUserSummaryInfoResponseType;
    }>(),
    fetchAllFollowing: props<{ username: string }>(),
    fetchAllFollowingSuccess: props<{
      usersResponse: AllUserSummaryInfoResponseType;
    }>(),
    updateFollowersList: props<{ user: UserSummaryInfoFollowing }>(),
    updateFollowingList: props<{ user: UserSummaryInfoFollowing }>(),
    removeAFollower: props<{ userId: number }>(),
    removeAFollowing: props<{ userId: number }>(),
    fetchNotifications: props<{ userId: number }>(),
    fetchNotificationsSuccess: props<{ allNotifications: AllNotificationsResponseType }>()
  },
});
