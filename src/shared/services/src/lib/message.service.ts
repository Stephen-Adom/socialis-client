/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, OnDestroy } from '@angular/core';
import { Client, IFrame, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable, filter, first, switchMap } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import * as localforage from 'localforage';

export enum SocketClientState {
  ATTEMPTING,
  CONNECTED,
}

export const environment = {
  production: false,
  api: 'http://localhost:8080/live',
};

@Injectable({
  providedIn: 'root',
})
export class MessageService implements OnDestroy {
  private client!: Client;
  private iFrame!: IFrame;
  private state!: BehaviorSubject<SocketClientState>;

  constructor() {
    // this.initializeConnection();
  }

  async initializeConnection() {
    this.state = new BehaviorSubject<SocketClientState>(
      SocketClientState.ATTEMPTING
    );

    const token = await localforage.getItem('accessToken');

    this.client = new StompJs.Client();
    this.client = StompJs.Stomp.over(new SockJS(environment.api));

    this.client.connectHeaders = {
      Authorization: 'Bearer ' + token,
    };

    this.client.onConnect = (frame) => {
      this.iFrame = frame;
      this.state.next(SocketClientState.CONNECTED);
      console.log('websocket connected');
    };

    this.client.onStompError = function (frame) {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  connect(): Observable<Client> {
    return new Observable<Client>((observer) => {
      this.state
        .pipe(filter((state) => state === SocketClientState.CONNECTED))
        .subscribe(() => {
          observer.next(this.client);
        });
    });
  }

  onMessage(topic: string): Observable<any> {
    return this.connect().pipe(
      first(),
      switchMap((client) => {
        return new Observable<any>((observer) => {
          const subscription: StompSubscription = client.subscribe(
            topic,
            (message) => {
              observer.next(JSON.parse(message.body));
            }
          );
          return () => client.unsubscribe(subscription.id);
        });
      })
    );
  }

  send(topic: string, payload: any): void {
    this.connect()
      .pipe(first())
      .subscribe((client) =>
        client.publish({ destination: topic, body: JSON.stringify(payload) })
      );
  }

  ngOnDestroy() {
    this.connect()
      .pipe(first())
      .subscribe((client) => client.onDisconnect(this.iFrame));
  }
}
