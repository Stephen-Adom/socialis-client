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
import { UserInfoType } from 'utils';

export const featurePostKey = 'post';

export interface PostState {
  allPosts: PostType[];
  postDetails: PostType | null;
  postComments: CommentType[];
  commentDetails: CommentType | null;
  allReplies: ReplyType[];
  editPost: PostType | null;
  editComment: CommentType | null;
  editReply: ReplyType | null;
  allBookmarks: PostType[] | CommentType[] | ReplyType[];
}

const initialState: PostState = {
  allPosts: [],
  postDetails: null,
  postComments: [],
  commentDetails: null,
  allReplies: [],
  editPost: null,
  editComment: null,
  editReply: null,
  allBookmarks: [],
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

export const getAllBookmarks = createSelector(
  selectPostFeature,
  (state: PostState) => state.allBookmarks
);

export const getEditPostDetails = createSelector(
  selectPostFeature,
  (state: PostState) => state.editPost
);

export const getEditCommentDetails = createSelector(
  selectPostFeature,
  (state: PostState) => state.editComment
);

export const getEditReplyDetails = createSelector(
  selectPostFeature,
  (state: PostState) => state.editReply
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
      commentDetails: state.commentDetails && action.comment,
    };
  }),
  on(PostApiActions.fetchPostByIdSuccess, (state: PostState, action) => {
    return {
      ...state,
      postDetails: action.post.data,
    };
  }),
  on(PostApiActions.togglePostLike, (state: PostState, action) => {
    return {
      ...state,
      allPosts: updatePostLike(
        action.post,
        action.authuser,
        action.isLiked,
        state.allPosts
      ),
      postDetails:
        state.postDetails &&
        updatePostLikeDetails(
          state.postDetails,
          action.isLiked,
          action.authuser
        ),
    };
  }),
  on(PostApiActions.toggleCommentLike, (state: PostState, action) => {
    return {
      ...state,
      postComments: updateCommentLike(
        action.comment,
        action.authuser,
        action.isLiked,
        state.postComments
      ),
      commentDetails:
        state.commentDetails &&
        updateCommentLikeDetails(
          state.commentDetails,
          action.isLiked,
          action.authuser
        ),
    };
  }),
  on(PostApiActions.toggleReplyLike, (state: PostState, action) => {
    return {
      ...state,
      allReplies: updateReplyLike(
        action.reply,
        action.authuser,
        action.isLiked,
        state.allReplies
      ),
    };
  }),
  on(PostApiActions.updateReply, (state: PostState, action) => {
    return {
      ...state,
      allReplies: updateReply(action.reply, state.allReplies),
    };
  }),
  on(PostApiActions.editPost, (state: PostState, action) => {
    return {
      ...state,
      editPost: action.post,
    };
  }),
  on(PostApiActions.completePostEdit, (state: PostState) => {
    return {
      ...state,
      editPost: null,
    };
  }),
  on(PostApiActions.deletePost, (state: PostState, action) => {
    return {
      ...state,
      allPosts: state.allPosts.filter((post) => post.id !== action.postId),
    };
  }),
  on(PostApiActions.editComment, (state: PostState, action) => {
    return {
      ...state,
      editComment: action.comment,
    };
  }),
  on(PostApiActions.completeEditComment, (state: PostState) => {
    return {
      ...state,
      editComment: null,
    };
  }),
  on(PostApiActions.deleteComment, (state: PostState, action) => {
    return {
      ...state,
      postComments: state.postComments.filter(
        (comment) => comment.id !== action.commentId
      ),
    };
  }),
  on(PostApiActions.editReply, (state: PostState, action) => {
    return {
      ...state,
      editReply: action.reply,
    };
  }),
  on(PostApiActions.completeEditComment, (state: PostState) => {
    return {
      ...state,
      editReply: null,
    };
  }),
  on(PostApiActions.deleteReply, (state: PostState, action) => {
    return {
      ...state,
      allReplies: state.allReplies.filter(
        (reply) => reply.id !== action.replyId
      ),
    };
  }),
  on(PostApiActions.fetchCommentByIdSuccess, (state: PostState, action) => {
    return {
      ...state,
      commentDetails: action.comment.data,
    };
  }),
  on(
    PostApiActions.fetchAllUserBookmarksSuccess,
    (state: PostState, action) => {
      return {
        ...state,
        allBookmarks: action.bookmarks.data,
      };
    }
  ),
  on(PostApiActions.toggleBookmarkPost, (state: PostState, action) => {
    return {
      ...state,
      allPosts: updatePostBookmarks(state.allPosts, action.post, action.userId),
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

const updateReply = (updatedReply: ReplyType, allReplies: ReplyType[]) => {
  return allReplies.map((reply) =>
    reply.id === updatedReply.id ? updatedReply : reply
  );
};

const updatePostLike = (
  post: PostType,
  user: UserInfoType,
  isLiked: boolean,
  allPost: PostType[]
) => {
  const postObj = { ...post };
  if (isLiked) {
    postObj.numberOfLikes--;
    postObj.likes = post.likes.filter(
      (like) => like.username !== user.username
    );
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    postObj.numberOfLikes++;
    postObj.likes = [likedBy, ...postObj.likes];
  }

  return allPost.map((post) => (post.id === postObj.id ? postObj : post));
};

const updatePostLikeDetails = (
  postDetails: PostType,
  isLiked: boolean,
  user: UserInfoType
) => {
  const postObj = { ...postDetails };
  if (isLiked) {
    postObj.numberOfLikes--;
    postObj.likes = postDetails.likes.filter(
      (like) => like.username !== user.username
    );
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    postObj.numberOfLikes++;
    postObj.likes = [likedBy, ...postObj.likes];
  }

  return postObj;
};
const updateCommentLikeDetails = (
  postDetails: CommentType,
  isLiked: boolean,
  user: UserInfoType
) => {
  const postObj = { ...postDetails };
  if (isLiked) {
    postObj.numberOfLikes--;
    postObj.likes = postDetails.likes.filter(
      (like) => like.username !== user.username
    );
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    postObj.numberOfLikes++;
    postObj.likes = [likedBy, ...postObj.likes];
  }

  return postObj;
};

const updateCommentLike = (
  comment: CommentType,
  user: UserInfoType,
  isLiked: boolean,
  allComment: CommentType[]
) => {
  const commentObj = { ...comment };
  if (isLiked) {
    commentObj.numberOfLikes--;
    commentObj.likes = comment.likes.filter(
      (like) => like.username !== user.username
    );
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    commentObj.numberOfLikes++;
    commentObj.likes = [likedBy, ...commentObj.likes];
  }

  return allComment.map((comment) =>
    comment.id === commentObj.id ? commentObj : comment
  );
};

const updateReplyLike = (
  reply: ReplyType,
  user: UserInfoType,
  isLiked: boolean,
  allReply: ReplyType[]
) => {
  const replyObj = { ...reply };
  if (isLiked) {
    replyObj.numberOfLikes--;
    replyObj.likes = reply.likes.filter(
      (like) => like.username !== user.username
    );
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    replyObj.numberOfLikes++;
    replyObj.likes = [likedBy, ...replyObj.likes];
  }

  return allReply.map((reply) => (reply.id === replyObj.id ? replyObj : reply));
};

const updatePostBookmarks = (
  allPosts: PostType[],
  post: PostType,
  userId: number
) => {
  const postObj = { ...post };
  const userExist = postObj.bookmarkedUsers.find((id) => id === userId);

  if (userExist) {
    postObj.bookmarkedUsers = postObj.bookmarkedUsers.filter(
      (id) => id !== userId
    );
    postObj.numberOfBookmarks--;
  } else {
    postObj.bookmarkedUsers = [...postObj.bookmarkedUsers, userId];
    postObj.numberOfBookmarks++;
  }

  return allPosts.map((currentPost) =>
    currentPost.id === post.id ? postObj : currentPost
  );
};
