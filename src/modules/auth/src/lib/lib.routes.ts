import { Route } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const authRoutes: Route[] = [
  { path: 'register', pathMatch: 'full', component: RegisterComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  {
    path: 'forgot-password',
    pathMatch: 'full',
    component: ForgotPasswordComponent,
  },
];
