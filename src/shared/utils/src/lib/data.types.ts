export type ErrorMessageType = {
  error: string;
  messages: string[];
  message?: string;
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
};

export type AuthResponseType = {
  status: string;
  data: UserInfoType;
  accessToken: string;
  refreshToken: string;
};

export type PostImage = {
  id: number;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: number;
  content: string;
  numberOfLikes: number;
  numberOfComments: number;
  createdAt: string;
  updatedAt: string;
  postImages: PostImage[];
  comments: any[];
};

export type NewPostResponseType = {
  status: string;
  data: Post;
};
