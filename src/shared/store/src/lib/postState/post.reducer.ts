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
  userPosts: PostType[];
  userComments: CommentType[];
  userReplies: ReplyType[];
  userPostLikes: PostType[] | CommentType[] | ReplyType[];
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
  userPosts: [],
  userComments: [],
  userReplies: [],
  userPostLikes: [],
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

export const getTotalBookmarks = createSelector(
  selectPostFeature,
  (state: PostState) => state.allBookmarks.length
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

export const getAllPostsByUser = createSelector(
  selectPostFeature,
  (state: PostState) => state.userPosts
);

export const getTotalPostsByUser = createSelector(
  selectPostFeature,
  (state: PostState) => state.userPosts.length
);

export const getAllCommentsByUser = createSelector(
  selectPostFeature,
  (state: PostState) => state.userComments
);

export const getAllRepliesByUser = createSelector(
  selectPostFeature,
  (state: PostState) => state.userReplies
);

export const getAllPostLikesByUser = createSelector(
  selectPostFeature,
  (state: PostState) => state.userPostLikes
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
      allBookmarks: updateBookmarks(action.post, state.allBookmarks),
      userPosts: updatePost(action.post, state.userPosts),
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
      allBookmarks: updateBookmarks(action.comment, state.allBookmarks),
      userComments: updateComment(action.comment, state.userComments),
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
      userPosts: updatePostLike(
        action.post,
        action.authuser,
        action.isLiked,
        state.allPosts
      ),
      userPostLikes: updateUserPostLike(
        action.post,
        action.authuser,
        action.isLiked,
        state.userPostLikes
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
      userComments: updateCommentLike(
        action.comment,
        action.authuser,
        action.isLiked,
        state.userComments
      ),
      userPostLikes: updateUserCommentLike(
        action.comment,
        action.authuser,
        action.isLiked,
        state.userPostLikes
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
      userReplies: updateReplyLike(
        action.reply,
        action.authuser,
        action.isLiked,
        state.userReplies
      ),
      userPostLikes: updateUserReplyLike(
        action.reply,
        action.authuser,
        action.isLiked,
        state.userPostLikes
      ),
    };
  }),
  on(PostApiActions.updateReply, (state: PostState, action) => {
    return {
      ...state,
      allReplies: updateReply(action.reply, state.allReplies),
      allBookmarks: updateBookmarks(action.reply, state.allBookmarks),
      userReplies: updateReply(action.reply, state.userReplies),
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
      userPosts: state.userPosts.filter((post) => post.id !== action.postId),
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
      postDetails:
        state.postDetails &&
        updatePostBookmarksDetails(state.postDetails, action.userId),
      userPosts: updatePostBookmarks(
        state.userPosts,
        action.post,
        action.userId
      ),
      userPostLikes: updateUserPostBookmark(
        state.userPostLikes,
        action.post,
        action.userId
      ),
    };
  }),
  on(PostApiActions.toggleBookmarkComment, (state: PostState, action) => {
    return {
      ...state,
      postComments: updateCommentBookmarks(
        state.postComments,
        action.comment,
        action.userId
      ),
      commentDetails:
        state.commentDetails &&
        updateCommentBookmarksDetails(state.commentDetails, action.userId),
      userComments: updateCommentBookmarks(
        state.userComments,
        action.comment,
        action.userId
      ),
      userPostLikes: updateUserPostBookmark(
        state.userPostLikes,
        action.comment,
        action.userId
      ),
    };
  }),
  on(PostApiActions.toggleBookmarkReplies, (state: PostState, action) => {
    return {
      ...state,
      allReplies: updateReplyBookmarks(
        state.allReplies,
        action.reply,
        action.userId
      ),
      userReplies: updateReplyBookmarks(
        state.userReplies,
        action.reply,
        action.userId
      ),
      userPostLikes: updateUserPostBookmark(
        state.userPostLikes,
        action.reply,
        action.userId
      ),
    };
  }),
  on(PostApiActions.updateUserBookmarks, (state: PostState, action) => {
    return {
      ...state,
      allBookmarks: action.bookmarks,
    };
  }),
  on(PostApiActions.fetchAllPostsByUserSuccess, (state: PostState, action) => {
    return {
      ...state,
      userPosts: action.allPosts.data,
    };
  }),
  on(
    PostApiActions.fetchAllCommentsByUserSuccess,
    (state: PostState, action) => {
      return {
        ...state,
        userComments: action.comments.data,
      };
    }
  ),
  on(
    PostApiActions.fetchAllRepliesByUserSuccess,
    (state: PostState, action) => {
      return {
        ...state,
        userReplies: action.replies.data,
      };
    }
  ),
  on(
    PostApiActions.fetchAllPostLikesByUserSuccess,
    (state: PostState, action) => {
      return {
        ...state,
        userPostLikes: action.postLikes.data,
      };
    }
  )
);

const updatePost = (updatedPost: PostType, allPost: PostType[]) => {
  return allPost.map((post) =>
    post.id === updatedPost.id ? updatedPost : post
  );
};

const updateBookmarks = (post: any, allBookmarks: any) => {
  return allBookmarks.map((bookmark: any) =>
    bookmark.id === post.id ? post : bookmark
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
  const userExist = postObj.bookmarkedUsers.includes(userId);

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
    currentPost.id === postObj.id ? postObj : currentPost
  );
};

const updatePostBookmarksDetails = (postDetails: PostType, userId: number) => {
  const postObj = { ...postDetails };
  const userExist = postObj.bookmarkedUsers.includes(userId);

  if (userExist) {
    postObj.bookmarkedUsers = postObj.bookmarkedUsers.filter(
      (id) => id !== userId
    );
    postObj.numberOfBookmarks--;
  } else {
    postObj.bookmarkedUsers = [...postObj.bookmarkedUsers, userId];
    postObj.numberOfBookmarks++;
  }

  return postObj;
};

const updateCommentBookmarks = (
  allComments: CommentType[],
  comment: CommentType,
  userId: number
) => {
  const commentObj = { ...comment };
  const userExist = commentObj.bookmarkedUsers.includes(userId);

  if (userExist) {
    commentObj.bookmarkedUsers = commentObj.bookmarkedUsers.filter(
      (id) => id !== userId
    );
    commentObj.numberOfBookmarks--;
  } else {
    commentObj.bookmarkedUsers = [...commentObj.bookmarkedUsers, userId];
    commentObj.numberOfBookmarks++;
  }

  return allComments.map((currentComment) =>
    currentComment.id === commentObj.id ? commentObj : currentComment
  );
};

const updateCommentBookmarksDetails = (
  commentDetails: CommentType,
  userId: number
) => {
  const commentObj = { ...commentDetails };
  const userExist = commentObj.bookmarkedUsers.includes(userId);

  if (userExist) {
    commentObj.bookmarkedUsers = commentObj.bookmarkedUsers.filter(
      (id) => id !== userId
    );
    commentObj.numberOfBookmarks--;
  } else {
    commentObj.bookmarkedUsers = [...commentObj.bookmarkedUsers, userId];
    commentObj.numberOfBookmarks++;
  }

  return commentObj;
};

const updateReplyBookmarks = (
  allReplies: ReplyType[],
  reply: ReplyType,
  userId: number
) => {
  const replyObj = { ...reply };
  const userExist = replyObj.bookmarkedUsers.includes(userId);

  if (userExist) {
    replyObj.bookmarkedUsers = replyObj.bookmarkedUsers.filter(
      (id) => id !== userId
    );
    replyObj.numberOfBookmarks--;
  } else {
    replyObj.bookmarkedUsers = [...replyObj.bookmarkedUsers, userId];
    replyObj.numberOfBookmarks++;
  }

  return allReplies.map((currentReply) =>
    currentReply.id === replyObj.id ? replyObj : currentReply
  );
};

const updateUserPostLike = (
  post: PostType,
  user: UserInfoType,
  isLiked: boolean,
  userPostLikes: any[]
) => {
  const postObj = { ...post };
  let likes = [];
  if (isLiked) {
    likes = userPostLikes.filter((like) => like.id !== post.id);
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    postObj.numberOfLikes++;
    postObj.likes = [likedBy, ...postObj.likes];
    likes = [postObj, ...userPostLikes];
  }

  return likes;
};

const updateUserCommentLike = (
  comment: CommentType,
  user: UserInfoType,
  isLiked: boolean,
  userPostLikes: any[]
) => {
  const commentObj = { ...comment };
  let likes = [];
  if (isLiked) {
    likes = userPostLikes.filter((like) => like.id !== comment.id);
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    commentObj.numberOfLikes++;
    commentObj.likes = [likedBy, ...commentObj.likes];
    likes = [commentObj, ...userPostLikes];
  }

  return likes;
};

const updateUserReplyLike = (
  reply: ReplyType,
  user: UserInfoType,
  isLiked: boolean,
  userPostLikes: any[]
) => {
  const replyObj = { ...reply };
  let likes = [];
  if (isLiked) {
    likes = userPostLikes.filter((like) => like.id !== reply.id);
  } else {
    const likedBy = {
      username: user.username,
      imageUrl: user.imageUrl,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    replyObj.numberOfLikes++;
    replyObj.likes = [likedBy, ...replyObj.likes];
    likes = [replyObj, ...userPostLikes];
  }

  return likes;
};

const updateUserPostBookmark = (
  userPostLikes: any[],
  post: PostType | CommentType | ReplyType,
  userId: number
) => {
  const postObj = { ...post };
  const userExist = postObj.bookmarkedUsers.includes(userId);

  if (userExist) {
    postObj.bookmarkedUsers = postObj.bookmarkedUsers.filter(
      (id) => id !== userId
    );
    postObj.numberOfBookmarks--;
  } else {
    postObj.bookmarkedUsers = [...postObj.bookmarkedUsers, userId];
    postObj.numberOfBookmarks++;
  }

  return userPostLikes.map((currentPost) =>
    currentPost.id === postObj.id ? postObj : currentPost
  );
};
