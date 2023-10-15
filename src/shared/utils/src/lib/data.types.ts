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

export type PostImage = {
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
  postImages: PostImage[];
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
