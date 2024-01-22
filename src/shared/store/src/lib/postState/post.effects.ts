/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  BookmarksService,
  CommentService,
  PostService,
  ReplyService,
  SuccessMessageService,
} from 'services';
import { PostApiActions } from './post.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApiActions } from '../appState/app.actions';
import {
  CommentType,
  PostType,
  ReplyType,
  SuccessMessageType,
  UserInfoType,
} from 'utils';
import { PostState } from './post.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: Actions,
    private store: Store<PostState>,
    private postservice: PostService,
    private replyService: ReplyService,
    private commentservice: CommentService,
    private bookmarkservice: BookmarksService,
    private successMessage: SuccessMessageService
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

  FetchAllPostsWithOffset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllPostsWithOffset),
      mergeMap((action: { offset: number }) =>
        this.postservice.fetchAllPostWithOffset(action.offset).pipe(
          map((response: any) => {
            this.store.dispatch(
              PostApiActions.togglePostFetchError({ status: false })
            );

            return PostApiActions.fetchAllPostsWithOffsetSuccess({
              allPosts: response,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error, 'error fetching post');
            this.store.dispatch(
              PostApiActions.toggleDataLoading({ loading: false })
            );
            this.store.dispatch(
              PostApiActions.togglePostFetchError({ status: true })
            );
            return of(
              AppApiActions.displayErrorMessage({ error: error.error })
            );
          })
        )
      )
    );
  });

  FetchPostById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchPostById),
      mergeMap((action: { postId: string }) =>
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
        this.commentservice.fetchAllComments(action.postId).pipe(
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
          likeType: string;
        }) =>
          this.postservice
            .togglePostLike(action.post.id, action.authuser.id, action.likeType)
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

  FetchCommentById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchCommentById),
      mergeMap((action: { commentId: string }) =>
        this.commentservice.fetchCommentById(action.commentId).pipe(
          map((response: any) => {
            return PostApiActions.fetchCommentByIdSuccess({
              comment: response,
            });
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

  ToggleReplyLike$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.toggleReplyLike),
      mergeMap(
        (action: {
          reply: ReplyType;
          authuser: UserInfoType;
          isLiked: boolean;
        }) =>
          this.postservice
            .toggleReplyLike(action.reply.id, action.authuser.id)
            .pipe(
              map(() => {
                return PostApiActions.toggleReplyLikeSuccess();
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

  FetchAllBookmarks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllUserBookmarks),
      mergeMap((action: { userId: number }) =>
        this.bookmarkservice.fetchAllBookmarks(action.userId).pipe(
          map((response: any) => {
            return PostApiActions.fetchAllUserBookmarksSuccess({
              bookmarks: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  TogglePostBookmarks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.toggleBookmarkPost),
      mergeMap((action: { post: PostType; userId: number }) =>
        this.bookmarkservice
          .toggleBookmark({
            userId: action.userId,
            contentId: action.post.id,
            contentType: 'post',
          })
          .pipe(
            map((response: any) => {
              this.handleSuccessResponse(response);

              return PostApiActions.toggleBookmarkPostSuccess();
            }),
            catchError((error: HttpErrorResponse) =>
              of(AppApiActions.displayErrorMessage({ error: error.error }))
            )
          )
      )
    );
  });

  ToggleCommentBookmarks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.toggleBookmarkComment),
      mergeMap((action: { comment: CommentType; userId: number }) =>
        this.bookmarkservice
          .toggleBookmark({
            userId: action.userId,
            contentId: action.comment.id,
            contentType: 'comment',
          })
          .pipe(
            tap((response: any) =>
              this.successMessage.sendSuccessMessage(response['message'])
            ),
            map(() => {
              return PostApiActions.toggleBookmarkCommentSuccess();
            }),
            catchError((error: HttpErrorResponse) =>
              of(AppApiActions.displayErrorMessage({ error: error.error }))
            )
          )
      )
    );
  });

  ToggleReplyBookmarks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.toggleBookmarkReplies),
      mergeMap((action: { reply: ReplyType; userId: number }) =>
        this.bookmarkservice
          .toggleBookmark({
            userId: action.userId,
            contentId: action.reply.id,
            contentType: 'reply',
          })
          .pipe(
            tap((response: any) =>
              this.successMessage.sendSuccessMessage(response['message'])
            ),
            map(() => {
              return PostApiActions.toggleBookmarkRepliesSuccess();
            }),
            catchError((error: HttpErrorResponse) =>
              of(AppApiActions.displayErrorMessage({ error: error.error }))
            )
          )
      )
    );
  });

  FetchAllPostsByUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllPostsByUser),
      mergeMap((action: { userId: number }) =>
        this.postservice.fetchAllPostsByUser(action.userId).pipe(
          map((response: any) => {
            return PostApiActions.fetchAllPostsByUserSuccess({
              allPosts: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  FetchAllCommentsByUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllCommentsByUser),
      mergeMap((action: { userId: number }) =>
        this.commentservice.fetchAllCommentByUser(action.userId).pipe(
          map((response: any) => {
            return PostApiActions.fetchAllCommentsByUserSuccess({
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

  FetchAllRepliesByUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllRepliesByUser),
      mergeMap((action: { userId: number }) =>
        this.replyService.fetchAllRepliesByUser(action.userId).pipe(
          map((response: any) => {
            return PostApiActions.fetchAllRepliesByUserSuccess({
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

  FetchAllLikesByUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.fetchAllPostLikesByUser),
      mergeMap((action: { userId: number }) =>
        this.postservice.fetchAllLikesByUser(action.userId).pipe(
          map((response: any) => {
            return PostApiActions.fetchAllPostLikesByUserSuccess({
              postLikes: response,
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AppApiActions.displayErrorMessage({ error: error.error }))
          )
        )
      )
    );
  });

  RepostWithNoContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.repostWithNoContent),
      mergeMap((action: { userId: number; postId: number }) =>
        this.postservice.repostWithNoContent(action.userId, action.postId).pipe(
          map((response: any) => {
            this.handleSuccessResponse(response);

            return PostApiActions.repostWithNoContentSuccess({
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

  undoRepost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PostApiActions.undoRepost),
      mergeMap((action: { repostId: number }) =>
        this.postservice.undoRepost(action.repostId).pipe(
          map((response: any) => {
            console.log(response, 'success response');
            this.handleSuccessResponse(response);

            return PostApiActions.undoRepostSuccess({
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

  handleSuccessResponse(response: SuccessMessageType) {
    this.successMessage.sendSuccessMessage(response['message']);
  }
}
