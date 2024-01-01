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
  followingStories: StoryType[];
}

const initialState: StoryState = {
  authUserStories: null,
  followingStories: [],
};

export const selectStoryFeature =
  createFeatureSelector<StoryState>(featureStoryKey);

export const getAuthUserStories = createSelector(
  selectStoryFeature,
  (state: StoryState) => state.authUserStories
);

export const getAllFollowingStories = createSelector(
  selectStoryFeature,
  (state: StoryState) => state.followingStories
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
  ),
  on(StoryApiActions.updateAuthUserStory, (state: StoryState, action) => {
    return {
      ...state,
      authUserStories: action.story,
    };
  }),
  on(
    StoryApiActions.fetchAllFollowingStoriesSuccess,
    (state: StoryState, action) => {
      return {
        ...state,
        followingStories: action.response.data,
      };
    }
  )
);
