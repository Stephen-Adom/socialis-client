/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StoryUploadService } from 'services';
import { StoryApiActions } from './story.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions } from '../appState/app.actions';

@Injectable({
  providedIn: 'root',
})
export class StoryEffects {
  constructor(
    private actions$: Actions,
    private storyUploadService: StoryUploadService
  ) {}

  FetchAuthUserStories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StoryApiActions.fetchAuthUserStories),
      mergeMap((action: { userId: number }) =>
        this.storyUploadService.fetchUserStoryById(action.userId).pipe(
          map((response: any) => {
            return StoryApiActions.fetchAuthUserStoriesSuccess({
              response: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });
}
