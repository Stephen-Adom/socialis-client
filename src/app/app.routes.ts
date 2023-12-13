import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('auth').then((m) => m.CustomAuthModule),
  },
  {
    path: '',
    loadChildren: () => import('layouts').then((m) => m.LayoutsModule),
  },
];
