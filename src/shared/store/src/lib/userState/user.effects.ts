/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from 'services';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions } from '../appState/app.actions';
import { UserApiActions } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userservice: UserService) {}

  FetchAllPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.fetchUserDetails),
      mergeMap((action: { username: string }) =>
        this.userservice.fetchUserFullInformation(action.username).pipe(
          map((response: any) => {
            return UserApiActions.fetchUserDetailsSuccess({
              userInfo: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  FollowUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.followUser),
      mergeMap((action: { followId: number; followingId: number }) =>
        this.userservice.followUser(action.followId, action.followingId).pipe(
          map(() => {
            return UserApiActions.followUserSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });
}
