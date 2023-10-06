import { createActionGroup, props } from '@ngrx/store';
import { ErrorMessageType } from 'utils';

export const AppApiActions = createActionGroup({
  source: 'App API',
  events: {
    displayErrorMessage: props<{ error: ErrorMessageType }>(),
  },
});
