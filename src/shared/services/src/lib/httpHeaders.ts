import { HttpHeaders } from '@angular/common/http';

export const getAuthHttpOptions = () => {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
};
