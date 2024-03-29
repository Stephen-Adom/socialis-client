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
  SuccessMessageType,
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
    clearCommentDetails: emptyProps(),
    clearReplyDetails: emptyProps(),
    clearAllCommentsDetails: emptyProps(),
    fetchPostComments: props<{ postId: number }>(),
    fetchPostCommentsSuccess: props<{ comments: AllCommentResponseType }>(),
    addNewComment: props<{ newComment: CommentType }>(),
    updateAPost: props<{ post: PostType }>(),
    getCommentDetails: props<{ comment: CommentType }>(),
    fetchReplies: props<{ commentId: number }>(),
    fetchRepliesSuccess: props<{ replies: AllRepliesResponseType }>(),
    addNewReply: props<{ newReply: ReplyType }>(),
    updateAComment: props<{ comment: CommentType }>(),
    fetchPostById: props<{ postId: string }>(),
    fetchPostByIdSuccess: props<{ post: PostResponseType }>(),
    togglePostLike: props<{
      post: PostType;
      authuser: UserInfoType;
      isLiked: boolean;
      likeType: string;
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
    fetchCommentById: props<{ commentId: string }>(),
    fetchCommentByIdSuccess: props<{ comment: CommentResponseType }>(),
    fetchAllUserBookmarks: props<{ userId: number }>(),
    fetchAllUserBookmarksSuccess: props<{ bookmarks: BookmarkResponseType }>(),
    toggleBookmarkPost: props<{
      post: PostType;
      userId: number;
    }>(),
    toggleBookmarkPostSuccess: emptyProps(),
    toggleBookmarkComment: props<{
      comment: CommentType;
      userId: number;
    }>(),
    toggleBookmarkCommentSuccess: emptyProps(),
    toggleBookmarkReplies: props<{
      reply: ReplyType;
      userId: number;
    }>(),
    toggleBookmarkRepliesSuccess: emptyProps(),
    updateUserBookmarks: props<{
      bookmarks: PostType[] | ReplyType[] | CommentType[];
    }>(),
    fetchAllPostsByUser: props<{ userId: number }>(),
    fetchAllPostsByUserSuccess: props<{ allPosts: AllPostResponseType }>(),
    fetchAllCommentsByUser: props<{ userId: number }>(),
    fetchAllCommentsByUserSuccess: props<{
      comments: AllCommentResponseType;
    }>(),
    fetchAllRepliesByUser: props<{ userId: number }>(),
    fetchAllRepliesByUserSuccess: props<{
      replies: AllRepliesResponseType;
    }>(),
    fetchAllPostLikesByUser: props<{ userId: number }>(),
    fetchAllPostLikesByUserSuccess: props<{
      postLikes: BookmarkResponseType;
    }>(),
    fetchAllPostsWithOffset: props<{ offset: number }>(),
    fetchAllPostsWithOffsetSuccess: props<{ allPosts: AllPostResponseType }>(),
    toggleDataLoading: props<{ loading: boolean }>(),
    repostWithNoContent: props<{ userId: number; postId: number }>(),
    repostWithNoContentSuccess: props<{ response: SuccessMessageType }>(),
    undoRepost: props<{ repostId: number }>(),
    undoRepostSuccess: props<{ response: SuccessMessageType }>(),
    repostWithContent: props<{ post: PostType }>(),
    clearRepost: emptyProps(),
    togglePostFetchError: props<{ status: boolean }>(),
  },
});
