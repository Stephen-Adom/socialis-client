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
        loadComponent: () =>
          import('dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('profile').then((m) => m.ProfileComponent),
      },
      {
        path: 'bookmarks',
        loadComponent: () =>
          import('bookmarks').then((m) => m.BookmarksComponent),
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
