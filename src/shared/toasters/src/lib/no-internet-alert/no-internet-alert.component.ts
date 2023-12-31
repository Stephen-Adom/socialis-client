import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoInternetService } from 'services';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-no-internet-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-internet-alert.component.html',
  styleUrls: ['./no-internet-alert.component.scss'],
})
export class NoInternetAlertComponent implements OnInit {
  notConnected$!: Observable<boolean>;

  constructor(private notInternetService: NoInternetService) {}

  ngOnInit(): void {
    this.notConnected$ = this.notInternetService.isNotConnectedObservable;
  }
}
