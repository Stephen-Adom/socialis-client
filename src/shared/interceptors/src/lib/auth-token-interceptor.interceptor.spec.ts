import { TestBed } from '@angular/core/testing';

import { AuthTokenInterceptorInterceptor } from './auth-token-interceptor.interceptor';

describe('AuthTokenInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthTokenInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthTokenInterceptorInterceptor = TestBed.inject(AuthTokenInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
