/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentService, PostService, ReplyService } from 'services';
import { PostApiActions } from './post.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions } from '../appState/app.actions';
import { CommentType, PostType, UserInfoType } from 'utils';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: Actions,
    private postservice: PostService,
    private replyService: ReplyService,
    private commentservice: CommentService
  ) {}

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

  FetchPostById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchPostById),
      mergeMap((action: { postId: number }) =>
        this.postservice.fetchPostById(action.postId).pipe(
          map((response: any) => {
            return PostApiActions.fetchPostByIdSuccess({ post: response });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  FetchAllPostComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchPostComments),
      mergeMap((action: { postId: number }) =>
        this.commentservice.fetchAllPost(action.postId).pipe(
          map((response: any) => {
            return PostApiActions.fetchPostCommentsSuccess({
              comments: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  TogglePostLike$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.togglePostLike),
      mergeMap(
        (action: {
          post: PostType;
          authuser: UserInfoType;
          isLiked: boolean;
        }) =>
          this.postservice
            .togglePostLike(action.post.id, action.authuser.id)
            .pipe(
              map(() => {
                return PostApiActions.togglePostLikeSuccess();
              }),
              catchError((error: HttpErrorResponse) =>
                of(AppApiActions.displayErrorMessage({ error: error.error }))
              )
            )
      )
    );
  });

  ToggleCommentLike$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.toggleCommentLike),
      mergeMap(
        (action: {
          comment: CommentType;
          authuser: UserInfoType;
          isLiked: boolean;
        }) =>
          this.postservice
            .toggleCommentLike(action.comment.id, action.authuser.id)
            .pipe(
              map(() => {
                return PostApiActions.toggleCommentLikeSuccess();
              }),
              catchError((error: HttpErrorResponse) =>
                of(AppApiActions.displayErrorMessage({ error: error.error }))
              )
            )
      )
    );
  });

  FetchAllReplies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchReplies),
      mergeMap((action: { commentId: number }) =>
        this.replyService.fetchAllReplies(action.commentId).pipe(
          map((response: any) => {
            return PostApiActions.fetchRepliesSuccess({
              replies: response,
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
