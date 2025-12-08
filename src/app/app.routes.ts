import { Routes } from '@angular/router';
import { routes as adminRouter } from './admin/admin.routing';
import { AuthGuard } from './authentication/auth-guard';
import { roleGuard } from './authentication/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./authentication/authentication').then((m) => m.Authentication),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: adminRouter,
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./user-dashboard/user-layout/user-layout').then((m) => m.UserLayout),
    canActivate: [AuthGuard, roleGuard],
    data: { roles: ['User'] },
  },
];
