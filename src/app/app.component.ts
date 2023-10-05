import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorToasterComponent } from 'notification';

@Component({
  standalone: true,
  imports: [RouterModule, ErrorToasterComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'socialis-client';
}
