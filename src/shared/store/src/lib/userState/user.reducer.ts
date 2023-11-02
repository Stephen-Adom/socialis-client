/* eslint-disable @nx/enforce-module-boundaries */
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { UserInfoType } from 'utils';
import { UserApiActions } from './user.actions';

export const featureUserKey = 'user';

export interface UserState {
  authorInformation: UserInfoType | null;
}

const initialState: UserState = {
  authorInformation: null,
};

export const selectUserFeature =
  createFeatureSelector<UserState>(featureUserKey);

export const getAuthorInformation = createSelector(
  selectUserFeature,
  (state: UserState) => state.authorInformation
);

export const UserReducer = createReducer<UserState>(
  initialState,
  on(UserApiActions.fetchUserDetailsSuccess, (state: UserState, action) => {
    return {
      ...state,
      authorInformation: action.userInfo.data,
    };
  })
);
