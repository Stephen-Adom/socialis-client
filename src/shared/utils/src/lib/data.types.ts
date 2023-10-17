export type ErrorMessageType = {
  error: string;
  messages?: string[];
  message?: string;
};

export type SuccessMessageType = {
  error: string;
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
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  loginCount: number;
  imageUrl: string;
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
  content: string;
  numberOfLikes: number;
  numberOfComments: number;
  createdAt: string;
  updatedAt: string;
  postImages: ImageType[];
  user: SimpleUserInfoType;
};

export type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: 0;
  numberOfReplies: 0;
  commentImages: ImageType[];
  user: SimpleUserInfoType;
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
