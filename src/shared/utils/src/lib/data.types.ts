export type ErrorMessageType = {
  error: string;
  messages: string[];
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
