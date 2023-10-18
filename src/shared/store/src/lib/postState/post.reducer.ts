/* eslint-disable @nx/enforce-module-boundaries */
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { PostApiActions } from './post.actions';
import { CommentType, PostType } from 'utils';
import { ReplyType } from 'utils';

export const featurePostKey = 'post';

export interface PostState {
  allPosts: PostType[];
  postDetails: PostType | null;
  postComments: CommentType[];
  commentDetails: CommentType | null;
  allReplies: ReplyType[];
}

const initialState: PostState = {
  allPosts: [],
  postDetails: null,
  postComments: [],
  commentDetails: null,
  allReplies: [],
};

export const selectPostFeature =
  createFeatureSelector<PostState>(featurePostKey);

export const getAllPosts = createSelector(
  selectPostFeature,
  (state: PostState) => state.allPosts
);

export const getPostDetails = createSelector(
  selectPostFeature,
  (state: PostState) => state.postDetails
);

export const getAllCommentForAPost = createSelector(
  selectPostFeature,
  (state: PostState) => state.postComments
);

export const getCommentDetails = createSelector(
  selectPostFeature,
  (state: PostState) => state.commentDetails
);

export const getAllReplies = createSelector(
  selectPostFeature,
  (state: PostState) => state.allReplies
);

export const PostReducer = createReducer<PostState>(
  initialState,
  on(PostApiActions.fetchAllPostSuccess, (state: PostState, action) => {
    return {
      ...state,
      allPosts: action.allPosts.data,
    };
  }),
  on(PostApiActions.addNewPost, (state: PostState, action) => {
    const currentPost = [action.newPost, ...state.allPosts];
    return {
      ...state,
      allPosts: currentPost,
    };
  }),
  on(PostApiActions.getPostDetails, (state: PostState, action) => {
    return {
      ...state,
      postDetails: action.post,
    };
  }),
  on(PostApiActions.clearPostDetails, (state: PostState) => {
    return {
      ...state,
      postDetails: null,
    };
  }),
  on(PostApiActions.fetchPostCommentsSuccess, (state: PostState, action) => {
    return {
      ...state,
      postComments: action.comments.data,
    };
  }),
  on(PostApiActions.addNewComment, (state: PostState, action) => {
    const currentComments = [action.newComment, ...state.postComments];
    return {
      ...state,
      postComments: currentComments,
    };
  }),
  on(PostApiActions.updateAPost, (state: PostState, action) => {
    return {
      ...state,
      allPosts: updatePost(action.post, state.allPosts),
      postDetails: state.postDetails && action.post,
    };
  }),
  on(PostApiActions.getCommentDetails, (state: PostState, action) => {
    return {
      ...state,
      commentDetails: action.comment,
    };
  }),
  on(PostApiActions.fetchRepliesSuccess, (state: PostState, action) => {
    return {
      ...state,
      allReplies: action.replies.data,
    };
  }),
  on(PostApiActions.addNewReply, (state: PostState, action) => {
    const currentReplies = [action.newReply, ...state.allReplies];
    return {
      ...state,
      allReplies: currentReplies,
    };
  }),
  on(PostApiActions.updateAComment, (state: PostState, action) => {
    return {
      ...state,
      postComments: updateComment(action.comment, state.postComments),
    };
  }),
  on(PostApiActions.fetchPostByIdSuccess, (state: PostState, action) => {
    return {
      ...state,
      postDetails: action.post.data,
    };
  })
);

const updatePost = (updatedPost: PostType, allPost: PostType[]) => {
  return allPost.map((post) =>
    post.id === updatedPost.id ? updatedPost : post
  );
};

const updateComment = (
  updatedComment: CommentType,
  allComments: CommentType[]
) => {
  return allComments.map((comment) =>
    comment.id === updatedComment.id ? updatedComment : comment
  );
};
