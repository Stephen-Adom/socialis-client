import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { authRoutes } from './lib.routes';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AnimateSvgComponent } from './login/animate-svg/animate-svg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotAnimateComponent } from './forgot-password/forgot-animate/forgot-animate.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(authRoutes)],
  declarations: [
    RegisterComponent,
    LoginComponent,
    AnimateSvgComponent,
    ForgotPasswordComponent,
    ForgotAnimateComponent,
  ],
})
export class AuthModule {}
