/* eslint-disable @nx/enforce-module-boundaries */
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { StoryType } from 'utils';
import { StoryApiActions } from './story.actions';

export const featureStoryKey = 'story';

export interface StoryState {
  authUserStories: StoryType | null;
}

const initialState: StoryState = {
  authUserStories: null,
};

export const selectStoryFeature =
  createFeatureSelector<StoryState>(featureStoryKey);

export const getAuthUserStories = createSelector(
  selectStoryFeature,
  (state: StoryState) => state.authUserStories
);

export const StoryReducer = createReducer<StoryState>(
  initialState,
  on(
    StoryApiActions.fetchAuthUserStoriesSuccess,
    (state: StoryState, action) => {
      return {
        ...state,
        authUserStories: action.response.data,
      };
    }
  )
);
