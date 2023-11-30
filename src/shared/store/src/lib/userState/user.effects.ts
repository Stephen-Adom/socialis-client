/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService, UserService } from 'services';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions } from '../appState/app.actions';
import { UserApiActions } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userservice: UserService,
    private notificationservice: NotificationService
  ) {}

  FetchUserDetails$ = createEffect(() => {
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

  // FollowUser$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(UserApiActions.followUser),
  //     mergeMap((action: { followId: number; followingId: number }) =>
  //       this.userservice.followUser(action.followId, action.followingId).pipe(
  //         map(() => {
  //           return UserApiActions.followUserSuccess();
  //         }),
  //         catchError((error: HttpErrorResponse) =>
  //           of(AppApiActions.displayErrorMessage({ error: error.error }))
  //         )
  //       )
  //     )
  //   );
  // });

  // UnfollowUser$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(UserApiActions.unfollowUser),
  //     mergeMap((action: { followId: number; followingId: number }) =>
  //       this.userservice.unfollowUser(action.followId, action.followingId).pipe(
  //         map(() => {
  //           return UserApiActions.unfollowUser({
  //             followId: action.followId,
  //             followingId: action.followingId,
  //           });
  //         }),
  //         catchError((error: HttpErrorResponse) =>
  //           of(AppApiActions.displayErrorMessage({ error: error.error }))
  //         )
  //       )
  //     )
  //   );
  // });

  FetchAllFollowers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.fetchAllFollowers),
      mergeMap((action: { username: string }) =>
        this.userservice.fetchAllFollowers(action.username).pipe(
          map((usersResponse) => {
            return UserApiActions.fetchAllFollowersSuccess({ usersResponse });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  FetchAllFollowings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.fetchAllFollowing),
      mergeMap((action: { username: string }) =>
        this.userservice.fetchAllFollowings(action.username).pipe(
          map((usersResponse) => {
            return UserApiActions.fetchAllFollowingSuccess({ usersResponse });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  FetchUserNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.fetchNotifications),
      mergeMap((action: { userId: number }) =>
        this.notificationservice.getUserNotifications(action.userId).pipe(
          map((response: any) => {
            return UserApiActions.fetchNotificationsSuccess({
              allNotifications: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  FetchUnreadNotificationsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.fetchUnreadNotificationCount),
      mergeMap((action: { userId: number }) =>
        this.notificationservice
          .getUserUnreadNotificationCount(action.userId)
          .pipe(
            map((response: any) => {
              return UserApiActions.fetchUnreadNotificationCountSuccess({
                unreadNotificationCount: response,
              });
            }),
            catchError((error: HttpErrorResponse) =>
              of(AppApiActions.displayErrorMessage({ error: error.error }))
            )
          )
      )
    );
  });

  markNotificationAsRead$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserApiActions.markNotificationAsRead),
      mergeMap((action: { notificationId: number }) =>
        this.notificationservice
          .markNotificationAsRead(action.notificationId)
          .pipe(
            map((response: any) => {
              return UserApiActions.markNotificationAsReadSuccess({
                response,
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
