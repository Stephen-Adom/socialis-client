/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, props } from '@ngrx/store';
import { AllStoriesType } from 'utils';

export const StoryApiActions = createActionGroup({
  source: 'STORY API',
  events: {
    fetchAuthUserStories: props<{ userId: number }>(),
    fetchAuthUserStoriesSuccess: props<{ response: AllStoriesType }>(),
  },
});
