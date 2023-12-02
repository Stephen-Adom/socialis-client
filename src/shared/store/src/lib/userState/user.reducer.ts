/* eslint-disable @nx/enforce-module-boundaries */
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Notifications, UserSummaryInfoFollowing } from 'utils';
import { UserApiActions } from './user.actions';

export const featureUserKey = 'user';

export interface UserState {
  authorInformation: UserSummaryInfoFollowing | null;
  authUserFollowers: UserSummaryInfoFollowing[];
  authUserFollowing: UserSummaryInfoFollowing[];
  authNotifications: Notifications[];
  unreadNotificationCount: number;
}

const initialState: UserState = {
  authorInformation: null,
  authUserFollowers: [],
  authUserFollowing: [],
  authNotifications: [],
  unreadNotificationCount: 0,
};

export const selectUserFeature =
  createFeatureSelector<UserState>(featureUserKey);

export const getAuthorInformation = createSelector(
  selectUserFeature,
  (state: UserState) => state.authorInformation
);

export const getAllAuthUserFollowers = createSelector(
  selectUserFeature,
  (state: UserState) => state.authUserFollowers
);

export const getAllAuthUserFollowing = createSelector(
  selectUserFeature,
  (state: UserState) => state.authUserFollowing
);

export const getAllUserNotifications = createSelector(
  selectUserFeature,
  (state: UserState) => state.authNotifications
);

export const getUnreadNotificationTotalCount = createSelector(
  selectUserFeature,
  (state: UserState) => state.unreadNotificationCount
);

export const UserReducer = createReducer<UserState>(
  initialState,
  on(UserApiActions.fetchUserDetailsSuccess, (state: UserState, action) => {
    return {
      ...state,
      authorInformation: action.userInfo.data,
    };
  }),
  on(UserApiActions.fetchAllFollowersSuccess, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowers: action.usersResponse.data,
    };
  }),
  on(UserApiActions.fetchAllFollowingSuccess, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowing: action.usersResponse.data,
    };
  }),
  on(UserApiActions.updateFollowersList, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowers: [...state.authUserFollowers, action.user],
    };
  }),
  on(UserApiActions.updateFollowingList, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowing: [...state.authUserFollowing, action.user],
    };
  }),
  on(UserApiActions.removeAFollower, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowers: state.authUserFollowers.filter(
        (follower) => follower.id !== action.userId
      ),
    };
  }),
  on(UserApiActions.removeAFollowing, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowing: state.authUserFollowing.filter(
        (following) => following.id !== action.userId
      ),
    };
  }),
  on(UserApiActions.fetchNotificationsSuccess, (state: UserState, action) => {
    return {
      ...state,
      authNotifications: action.allNotifications.data,
    };
  }),

  on(
    UserApiActions.fetchUnreadNotificationCountSuccess,
    (state: UserState, action) => {
      return {
        ...state,
        unreadNotificationCount: action.unreadNotificationCount.data,
      };
    }
  ),
  on(UserApiActions.newNotification, (state: UserState, action) => {
    return {
      ...state,
      authNotifications: [action.notification, ...state.authNotifications],
    };
  }),
  on(
    UserApiActions.updateUnreadNotificationCount,
    (state: UserState, action) => {
      return {
        ...state,
        unreadNotificationCount: action.unreadCount,
      };
    }
  )
);
