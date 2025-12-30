import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const allowedRoles = route.data['roles'];

  const userData = localStorage.getItem('user');

  if (!userData) {
    router.navigate(['/auth']);
    return false;
  }

  const user = JSON.parse(userData);

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};
