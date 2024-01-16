import { Route } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';
import { authGuard } from 'guards';

export const layoutsRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    component: WrapperComponent,
    children: [
      {
        path: 'feeds',
        title: 'Feeds | Socialis',
        loadComponent: () =>
          import('dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        title: 'Profile | Socialis',
        loadComponent: () => import('profile').then((m) => m.ProfileComponent),
      },
      {
        path: 'bookmarks',
        title: 'Bookmarks | Socialis',
        loadComponent: () =>
          import('bookmarks').then((m) => m.BookmarksComponent),
      },
      {
        path: 'friends',
        title: 'Friends | Socialis',
        loadComponent: () => import('friends').then((m) => m.FriendsComponent),
      },
      {
        path: 'user/:username/profile',
        loadComponent: () =>
          import('user-profile').then((m) => m.UserProfileComponent),
      },
      {
        path: ':username/details/:id',
        loadComponent: () =>
          import('post-details').then((m) => m.PostDetailsComponent),
      },
      {
        path: ':username/details/:postId/:commentUsername/details/:commentId',
        loadComponent: () =>
          import('comment-details').then((m) => m.CommentDetailsComponent),
      },
    ],
  },
];
