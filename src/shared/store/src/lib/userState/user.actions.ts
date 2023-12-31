/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, props } from '@ngrx/store';
import {
  AllNotificationsResponseType,
  AllUserSummaryInfoResponseType,
  Notifications,
  SuccessMessageType,
  UserSummaryInfoFollowing,
  UserSummaryInfoResponseType,
} from 'utils';
import { emptyProps } from '@ngrx/store';

export const UserApiActions = createActionGroup({
  source: 'USER API',
  events: {
    fetchUserDetails: props<{ username: string }>(),
    fetchUserDetailsSuccess: props<{ userInfo: UserSummaryInfoResponseType }>(),
    followUser: props<{ user: UserSummaryInfoFollowing }>(),
    // followUserSuccess: emptyProps(),
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
    fetchNotificationsSuccess: props<{
      allNotifications: AllNotificationsResponseType;
    }>(),
    fetchUnreadNotificationCount: props<{ userId: number }>(),
    fetchUnreadNotificationCountSuccess: props<{
      unreadNotificationCount: {
        status: string;
        data: number;
      };
    }>(),
    markNotificationAsRead: props<{ notificationId: number }>(),
    markNotificationAsReadSuccess: props<{ response: SuccessMessageType }>(),
    newNotification: props<{ notification: Notifications }>(),
    updateUnreadNotificationCount: props<{ unreadCount: number }>(),
    markAllNotificationsAsRead: props<{ userId: number }>(),
    markAllNotificationsAsReadSuccess: props<{
      response: AllNotificationsResponseType;
    }>(),
  },
});
