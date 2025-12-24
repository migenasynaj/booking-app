import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingDetails } from '../../room/room-booking-model';
import { BookingService } from '../../bookings-service';
import { LoggedUserService } from '../../../shared-services/logged-user-service';
import { UserService } from '../../../shared-services/user-service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-bookings',
  imports: [RouterLink, DatePipe],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings {
  private bookingService = inject(BookingService);
  private loggedUser = inject(LoggedUserService);
  private userService = inject(UserService);
  userId!: string;
  loading = true;

  bookingDetails: BookingDetails[] = [];

  ngOnInit() {
    const id = this.loggedUser.getUserId();

    if (!id) {
      throw new Error('User not found in localStorage');
    }

    this.userId = id;

    this.loadBookings();
  }

  loadBookings() {
    console.log('Calling backend with userId:', this.userId);

    this.bookingService.getBookingPerUser(this.userId).subscribe({
      next: (bookingDetails) => {
        this.bookingDetails = bookingDetails.sort(
          (a, b) => new Date(b.bookFrom).getTime() - new Date(a.bookFrom).getTime()
        );
        console.log('Bookings:', this.bookingDetails);

        this.loading = false;
      },
      error: (err) => {
        console.log('booking details not loaded', err);
        this.loading = false;
      },
    });
  }
}
