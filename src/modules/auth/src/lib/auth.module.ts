import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from 'services';
import { ActivateAccountNotificationComponent } from 'notification';

import { authRoutes } from './lib.routes';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AnimateSvgComponent } from './login/animate-svg/animate-svg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotAnimateComponent } from './forgot-password/forgot-animate/forgot-animate.component';
import { ErrorMessageComponent } from './errorMessage/error-message.component';
import { AuthComponent } from './auth/auth.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    ActivateAccountNotificationComponent,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    AnimateSvgComponent,
    ForgotPasswordComponent,
    ForgotAnimateComponent,
    ErrorMessageComponent,
    AuthComponent,
    VerifyEmailAddressComponent,
  ],
  providers: [AuthenticationService],
})
export class AuthModule {}
