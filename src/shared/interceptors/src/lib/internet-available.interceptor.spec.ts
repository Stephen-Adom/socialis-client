import { TestBed } from '@angular/core/testing';

import { InternetAvailableInterceptor } from './internet-available.interceptor';

describe('InternetAvailableInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      InternetAvailableInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: InternetAvailableInterceptor = TestBed.inject(InternetAvailableInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
