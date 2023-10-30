export type ErrorMessageType = {
  error: string;
  messages?: string[];
  message?: string;
};

export type SuccessMessageType = {
  status: string;
  message: string;
};

export type UserRegistrationDetailsType = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};

export type UserInfoType = {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  loginCount: number;
  imageUrl: string;
  coverImageUrl: string;
  bio: string;
  phonenumber: string;
  address: string;
};

export type SimpleUserInfoType = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  imageUrl: string | null;
  bio: string | null;
};

export type AuthResponseType = {
  status: string;
  data: UserInfoType;
  accessToken: string;
  refreshToken: string;
};

export type ImageType = {
  id: number;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
};

export type PostType = {
  id: number;
  uid: string;
  content: string;
  numberOfLikes: number;
  numberOfComments: number;
  numberOfBookmarks: number;
  createdAt: string;
  updatedAt: string;
  postImages: ImageType[];
  user: SimpleUserInfoType;
  likes: LikeType[];
  bookmarkedUsers: number[];
};

export type LikeType = {
  username: string;
  imageUrl: string;
  firstname: string;
  lastname: string;
};

export type CommentType = {
  id: number;
  uid: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: number;
  numberOfReplies: number;
  numberOfBookmarks: number;
  commentImages: ImageType[];
  user: SimpleUserInfoType;
  likes: LikeType[];
  bookmarkedUsers: number[];
};

export type ReplyType = {
  id: number;
  uid: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: number;
  numberOfBookmarks: number;
  replyImages: ImageType[];
  user: SimpleUserInfoType;
  likes: LikeType[];
  bookmarkedUsers: number[];
};

export type NewPostResponseType = {
  status: string;
  data: PostType;
};

export type AllPostResponseType = {
  status: string;
  data: PostType[];
};

export type AllCommentResponseType = {
  status: string;
  data: CommentType[];
};

export type CommentResponseType = {
  status: string;
  data: CommentType;
};

export type AllRepliesResponseType = {
  status: string;
  data: ReplyType[];
};

export type PostResponseType = {
  status: string;
  data: PostType;
};

export type BookmarkResponseType = {
  data: PostType[] | ReplyType[] | CommentType[];
  status: string;
};
