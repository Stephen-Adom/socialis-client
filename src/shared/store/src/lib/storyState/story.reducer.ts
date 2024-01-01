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
  ),
  on(StoryApiActions.updateFollowingStories, (state: StoryState, action) => {
    const currentFollowingStories = [...state.followingStories];

    const storyExistIndex = currentFollowingStories.findIndex(
      (story) => story.user.username === action.story.user.username
    );

    let updatedFollowingStories = [];

    if (storyExistIndex !== -1) {
      updatedFollowingStories = currentFollowingStories.splice(
        storyExistIndex,
        1,
        action.story
      );
    } else {
      updatedFollowingStories = [action.story, ...currentFollowingStories];
    }

    return {
      ...state,
      followingStories: [...updatedFollowingStories],
    };
  }),
  on(StoryApiActions.updateWatchedStories, (state: StoryState, action) => {
    const currentFollowingStories = [...state.followingStories];

    const updatedFollowingStories = currentFollowingStories.map((following) =>
      following.user.username === action.story.user.username
        ? action.story
        : following
    );

    return {
      ...state,
      followingStories: [...updatedFollowingStories],
    };
  })
);
