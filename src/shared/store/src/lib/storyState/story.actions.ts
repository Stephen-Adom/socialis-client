/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, props } from '@ngrx/store';
import { AllStoriesType, StoryType, SuccessMessageType } from 'utils';

export const StoryApiActions = createActionGroup({
  source: 'STORY API',
  events: {
    fetchAuthUserStories: props<{ userId: number }>(),
    fetchAuthUserStoriesSuccess: props<{ response: AllStoriesType }>(),
    saveWatchedUser: props<{ userId: number; mediaId: number }>(),
    saveWatchedUserSuccess: props<{ response: SuccessMessageType }>(),
    updateAuthUserStory: props<{ story: StoryType }>(),
  },
});
