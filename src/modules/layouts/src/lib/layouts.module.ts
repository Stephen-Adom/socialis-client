import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { layoutsRoutes } from './lib.routes';
import { NavigationComponent } from './navigation/navigation.component';
import { WrapperComponent } from './wrapper/wrapper.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(layoutsRoutes)],
  declarations: [NavigationComponent, WrapperComponent],
})
export class LayoutsModule {}
