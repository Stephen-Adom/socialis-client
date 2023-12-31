import { HttpHeaders } from '@angular/common/http';
import * as localforage from 'localforage';

export const getNonAuthHttpOptions = () => {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
};

export const getAuthHttpOptions = async () => {
  const accessToken = <string>await localforage.getItem('accessToken');

  return {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
    }),
  };
};
