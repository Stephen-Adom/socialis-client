/* eslint-disable @nx/enforce-module-boundaries */
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { AppApiActions } from './app.actions';
import { ErrorMessageType, UserInfoType } from 'utils';

export const featureAppKey = 'app';

export interface AppState {
  error: ErrorMessageType | null;
  userInfo: UserInfoType | null;
  accessToken: string | null;
  refreshToken: string | null;
  uploadingStory: boolean;
}

const initialState: AppState = {
  error: null,
  userInfo: null,
  accessToken: null,
  refreshToken: null,
  uploadingStory: false,
};

export const selectAppFeature = createFeatureSelector<AppState>(featureAppKey);

export const getErrorMessage = createSelector(
  selectAppFeature,
  (state: AppState) => state.error
);

export const getUserInformation = createSelector(
  selectAppFeature,
  (state: AppState) => state.userInfo
);

export const getAccessToken = createSelector(
  selectAppFeature,
  (state: AppState) => state.accessToken
);

export const getRefreshToken = createSelector(
  selectAppFeature,
  (state: AppState) => state.refreshToken
);

export const getUploadStoryStatus = createSelector(
  selectAppFeature,
  (state: AppState) => state.uploadingStory
);

export const AppReducer = createReducer<AppState>(
  initialState,
  on(AppApiActions.displayErrorMessage, (state: AppState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(AppApiActions.storeUserAuthInfo, (state: AppState, action) => {
    return {
      ...state,
      userInfo: action.userInfo,
      accessToken: action.accessToken,
      refreshToken: action.refreshToken,
      error: null,
    };
  }),
  on(AppApiActions.clearUserAuthInfo, (state: AppState) => {
    return {
      ...state,
      userInfo: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    };
  }),
  on(AppApiActions.updateUserInfo, (state: AppState, action) => {
    return {
      ...state,
      userInfo: action.userInfo,
      error: null,
    };
  }),
  on(AppApiActions.uploadingStory, (state: AppState, action) => {
    return {
      ...state,
      uploadingStory: action.uploading,
    };
  })
);
