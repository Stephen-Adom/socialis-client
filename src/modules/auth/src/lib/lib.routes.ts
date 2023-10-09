import { Route } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth/auth.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'register', pathMatch: 'full', component: RegisterComponent },
      { path: 'login', pathMatch: 'full', component: LoginComponent },
      {
        path: 'forgot-password',
        pathMatch: 'full',
        component: ForgotPasswordComponent,
      },
      {
        path: 'verifyEmailAddress',
        pathMatch: 'full',
        component: VerifyEmailAddressComponent,
      },
    ],
  },
];
