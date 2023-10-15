/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from 'services';
import { PostApiActions } from './post.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions } from '../appState/app.actions';

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private postservice: PostService) {}

  FetchAllPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllPost),
      mergeMap(() =>
        this.postservice.fetchAllPost().pipe(
          map((response: any) => {
            return PostApiActions.fetchAllPostSuccess({ allPosts: response });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });
}
