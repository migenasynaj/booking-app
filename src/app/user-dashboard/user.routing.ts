import { Routes } from '@angular/router';

export const userRouter: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./guesthouses/top-guesthouses/top-guesthouses').then((m) => m.TopGuesthouses),
  },
  {
    path: 'guesthouses',
    loadComponent: () =>
      import('./guesthouses/guesthouse-list/guesthouse-list').then((m) => m.GuesthouseList),
  },

  {
    path: 'guesthouse/:guesthouseId/rooms',
    loadComponent: () => import('./room/room-list/room-list').then((m) => m.RoomList),
  },
  {
    path: 'profile',
    pathMatch: 'full',
    redirectTo: 'profile/details',
  },
  {
    path: 'profile/details',
    loadComponent: () =>
      import('./profile/profile-details/profile-details').then((m) => m.ProfileDetails),
  },
  {
    path: 'profile/bookings',
    loadComponent: () => import('./profile/profile-bookings/bookings').then((m) => m.Bookings),
  },
];
