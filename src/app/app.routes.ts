import { Routes } from '@angular/router';
import { routes as adminRouter } from './admin/admin.routing';

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
    children: adminRouter,
  },
];
