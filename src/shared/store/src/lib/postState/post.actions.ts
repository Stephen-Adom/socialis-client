/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AllCommentResponseType,
  AllPostResponseType,
  AllRepliesResponseType,
  BookmarkResponseType,
  CommentResponseType,
  CommentType,
  PostResponseType,
  PostType,
  ReplyType,
  UserInfoType,
} from 'utils';

export const PostApiActions = createActionGroup({
  source: 'Post API',
  events: {
    fetchAllPost: emptyProps(),
    fetchAllPostSuccess: props<{ allPosts: AllPostResponseType }>(),
    addNewPost: props<{ newPost: PostType }>(),
    getPostDetails: props<{ post: PostType }>(),
    clearPostDetails: emptyProps(),
    fetchPostComments: props<{ postId: number }>(),
    fetchPostCommentsSuccess: props<{ comments: AllCommentResponseType }>(),
    addNewComment: props<{ newComment: CommentType }>(),
    updateAPost: props<{ post: PostType }>(),
    getCommentDetails: props<{ comment: CommentType }>(),
    fetchReplies: props<{ commentId: number }>(),
    fetchRepliesSuccess: props<{ replies: AllRepliesResponseType }>(),
    addNewReply: props<{ newReply: ReplyType }>(),
    updateAComment: props<{ comment: CommentType }>(),
    fetchPostById: props<{ postId: number }>(),
    fetchPostByIdSuccess: props<{ post: PostResponseType }>(),
    togglePostLike: props<{
      post: PostType;
      authuser: UserInfoType;
      isLiked: boolean;
    }>(),
    togglePostLikeSuccess: emptyProps(),
    toggleCommentLike: props<{
      comment: CommentType;
      authuser: UserInfoType;
      isLiked: boolean;
    }>(),
    toggleCommentLikeSuccess: emptyProps(),
    toggleReplyLike: props<{
      reply: ReplyType;
      authuser: UserInfoType;
      isLiked: boolean;
    }>(),
    toggleReplyLikeSuccess: emptyProps(),
    updateReply: props<{ reply: ReplyType }>(),
    editPost: props<{ post: PostType }>(),
    completePostEdit: emptyProps(),
    deletePost: props<{ postId: number }>(),
    editComment: props<{ comment: CommentType }>(),
    completeEditComment: emptyProps(),
    deleteComment: props<{ commentId: number }>(),
    editReply: props<{ reply: ReplyType }>(),
    completeEditReply: emptyProps(),
    deleteReply: props<{ replyId: number }>(),
    fetchCommentById: props<{ commentId: number }>(),
    fetchCommentByIdSuccess: props<{ comment: CommentResponseType }>(),
    fetchAllUserBookmarks: props<{ userId: number }>(),
    fetchAllUserBookmarksSuccess: props<{ bookmarks: BookmarkResponseType }>(),
    toggleBookmarkPost: props<{
      post: PostType;
      userId: number;
    }>(),
    toggleBookmarkPostSuccess: emptyProps(),
  },
});
