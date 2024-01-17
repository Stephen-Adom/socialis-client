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
  noOfFollowers: number;
  noOfFollowing: number;
  noOfPosts: number;
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
  numberOfRepost: number;
  createdAt: string;
  updatedAt: string;
  postImages: ImageType[];
  user: SimpleUserInfoType;
  likes: LikeType[];
  bookmarkedUsers: number[];
  originalPost: PostType;
  resharedBy: { userId: number; resharedId: number; withContent: boolean }[];
};

export type LikeType = {
  username: string;
  imageUrl: string;
  firstname: string;
  lastname: string;
  likeType: string;
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

export type UserSummaryInfo = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  bio: string;
  imageUrl: string;
  totalPost: number;
  followers: number;
  following: number;
};

export type UserSummaryInfoFollowing = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  bio: string;
  imageUrl: string;
  coverImageUrl: string;
  phonenumber: string;
  address: string;
  totalPost: number;
  createdAt: string;
  followers: number;
  following: number;
  followersList: string[];
  followingList: string[];
};

export type Notifications = {
  id: number;
  // user: {
  //   id: number;
  //   uid: string;
  //   firstname: string;
  //   lastname: string;
  //   username: string;
  //   imageUrl: string | null;
  // },
  activityType: string;
  source: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    username: string;
    imageUrl: string;
  };
  target: {
    targetContent?: string;
    targetUid: string;
    targetImage: {
      id: number;
      mediaUrl: string;
      mediaType: string;
    };
    targetFirstname?: string;
    targetLastname?: string;
    targetUsername?: string;
    targetUrl?: string;
  };
  targetType: string;
  readAt: string;
  createdAt: string;
  read: boolean;
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

export type UserSummaryResponseType = {
  data: UserSummaryInfo;
  status: string;
};

export type UserSummaryInfoResponseType = {
  data: UserSummaryInfoFollowing;
  status: string;
};

export type AllUserSummaryResponseType = {
  data: UserSummaryInfo[];
  status: string;
};

export type AllUserSummaryInfoResponseType = {
  data: UserSummaryInfoFollowing[];
  status: string;
};

export type AllNotificationsResponseType = {
  data: Notifications[];
  status: string;
};

export type postImageType = {
  base64: string;
  file: File;
  id: number;
  type: string;
};

export type SocialUser = {
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
};

export type uploadMedia = {
  file: File;
  base64: string;
  caption: string;
  fileType: string;
};

export type StoriesResponseType = {
  status: string;
  data: StoryType | null;
};

export type AllStoriesResponseType = {
  status: string;
  data: StoryType[];
};

export type StoryType = {
  id: 1;
  user: SimpleUserInfoType;
  numberOfMedia: number;
  storyMedia: StoryMediaType[];
};

export type StoryMediaType = {
  id: number;
  mediaUrl: string;
  mediaCaption: string;
  mediaType: string;
  expiredAt: string;
  uploadedAt: string;
  watchedBy: WatchedByType[];
};

export type WatchedByType = {
  id: number;
  user: SimpleUserInfoType;
  watchedAt: string;
};

export type WatchedStoryResponseType = {
  status: string;
  data: WatchedByType;
};

export type AllWatchedStoriesResponseType = {
  status: string;
  data: WatchedByType[];
};
