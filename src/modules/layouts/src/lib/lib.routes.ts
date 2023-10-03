import { Route } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';

export const layoutsRoutes: Route[] = [
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: ':username/details/:id',
        loadComponent: () =>
          import('post-details').then((m) => m.PostDetailsComponent),
      },
    ],
  },
];
