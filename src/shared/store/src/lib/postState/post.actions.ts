/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { PostType } from 'utils';

export const PostApiActions = createActionGroup({
  source: 'Post API',
  events: {
    fetchAllPost: emptyProps(),
    fetchAllPostSuccess: props<{ allPosts: PostType[] }>(),
    fetchAllPostFail: props<{ error: HttpErrorResponse }>(),
  },
});
