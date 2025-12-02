import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'guesthouses',
    loadComponent: () =>
      import('./guesthouse/guesthouse-list/guesthouse-list').then((m) => m.GuesthouseList),
  },
  {
    path: 'rooms',
    loadComponent: () => import('./room/room-list/room-list').then((m) => m.RoomList),
  },
  {
    path: 'users',
    loadComponent: () => import('./user/user-list/user-list').then((m) => m.UserList),
  },
];
