import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from 'services';

import { authRoutes } from './lib.routes';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AnimateSvgComponent } from './login/animate-svg/animate-svg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotAnimateComponent } from './forgot-password/forgot-animate/forgot-animate.component';
import { ErrorMessageComponent } from './errorMessage/error-message.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    AnimateSvgComponent,
    ForgotPasswordComponent,
    ForgotAnimateComponent,
    ErrorMessageComponent,
  ],
  providers: [AuthenticationService],
})
export class AuthModule {}
