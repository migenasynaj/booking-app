import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BookedDateResponse } from './room/room-booking-model';

@Injectable({
  providedIn: 'root',
})
export class Bookings {
  private http = inject(HttpClient);

  getBookingsPerRoom(roomId: number) {
    return this.http.get<BookedDateResponse[]>(
      `${environment.apiUrl}${environment.endpoints.bookings.getByRoomId(roomId)}`
    );
  }

  getBookingPerUser() {}
}
