import { LikeType, UserInfoType } from './data.types';

export const generateLikeDescription = (
  likes: LikeType[],
  authUser: UserInfoType | null
) => {
  if (likes.length && likes.length == 1) {
    return `Liked by ${
      likes[0].username === authUser?.username
        ? 'You'
        : likes[0].firstname + ' ' + likes[0].lastname
    }`;
  } else if (likes.length === 2) {
    return `Liked by ${
      likes[0].username === authUser?.username
        ? 'You'
        : likes[0].firstname + ' ' + likes[0].lastname
    }  and ${likes[1].firstname + ' ' + likes[1].lastname}`;
  } else {
    return `Liked by ${
      likes[0].username === authUser?.username
        ? 'You'
        : likes[0].firstname + ' ' + likes[0].lastname
    } and ${likes.length - 1} others`;
  }
};
