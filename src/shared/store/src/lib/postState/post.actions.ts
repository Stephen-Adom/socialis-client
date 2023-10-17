/* eslint-disable @nx/enforce-module-boundaries */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AllCommentResponseType,
  AllPostResponseType,
  AllRepliesResponseType,
  CommentType,
  PostType,
  ReplyType,
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
  },
});
