import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authentication = inject(AuthenticationService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authentication.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }
}
