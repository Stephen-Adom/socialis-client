/* eslint-disable @nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, InnactiveAccountService } from 'services';
import { ActivateAccountNotificationComponent } from 'notification';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';

import { authRoutes } from './lib.routes';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AnimateSvgComponent } from './login/animate-svg/animate-svg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotAnimateComponent } from './forgot-password/forgot-animate/forgot-animate.component';
import { ErrorMessageComponent } from './errorMessage/error-message.component';
import { AuthComponent } from './auth/auth.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    ActivateAccountNotificationComponent,
    ErrorMessageComponent,
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    AnimateSvgComponent,
    ForgotPasswordComponent,
    ForgotAnimateComponent,
    AuthComponent,
    VerifyEmailAddressComponent,
    ResetPasswordComponent,
  ],
  providers: [AuthenticationService, InnactiveAccountService],
})
export class CustomAuthModule {}
