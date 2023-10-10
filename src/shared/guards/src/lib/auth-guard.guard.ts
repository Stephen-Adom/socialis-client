import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from 'services';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authservice: AuthenticationService = inject(AuthenticationService);
  const router: Router = inject(Router);

  authservice.tokenExist().then((accessToken): any => {
    if (!accessToken) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (authservice.tokenIsExpired(accessToken)) {
      router.navigate(['/auth/login']);
      return false;
    }
  });

  return true;
};
