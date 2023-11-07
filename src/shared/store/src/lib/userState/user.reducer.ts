/* eslint-disable @nx/enforce-module-boundaries */
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { UserSummaryInfoFollowing, UserSummaryInfo } from 'utils';
import { UserApiActions } from './user.actions';

export const featureUserKey = 'user';

export interface UserState {
  authorInformation: UserSummaryInfoFollowing | null;
  authUserFollowers: UserSummaryInfo[];
  authUserFollowing: UserSummaryInfo[];
}

const initialState: UserState = {
  authorInformation: null,
  authUserFollowers: [],
  authUserFollowing: [],
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
  on(UserApiActions.unfollowUser, (state: UserState, action) => {
    return {
      ...state,
      authUserFollowing: state.authUserFollowing.filter(
        (following) => following.id !== action.followingId
      ),
    };
  })
);
