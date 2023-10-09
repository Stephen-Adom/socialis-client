import { Component, OnInit } from '@angular/core';
import * as localforage from 'localforage';

@Component({
  selector: 'feature-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  innactiveAccount = false;

  ngOnInit(): void {
    localforage.getItem('userInfo').then((data: any) => {
      if (data && !data.enabled) {
        this.innactiveAccount = true;
      }
    });
  }
}
