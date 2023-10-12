/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AllPostResponseType } from 'utils';

export const PostApiActions = createActionGroup({
  source: 'Post API',
  events: {
    fetchAllPost: props<{ userId: number }>(),
    fetchAllPostSuccess: props<{ allPosts: AllPostResponseType }>(),
  },
});
