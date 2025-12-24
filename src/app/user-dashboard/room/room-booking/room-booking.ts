import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BookedDateResponse, roomBooking } from '../room-booking-model';
import { RoomService } from '../../../shared-services/room-service';
import { BookingService } from '../../bookings-service';
import { SearchGuesthouseService } from '../../../shared-services/search-guesthouse-service';

@Component({
  selector: 'app-room-booking',
  imports: [ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './room-booking.html',
  styleUrl: './room-booking.css',
})
export class RoomBooking {
  private bookingService = inject(BookingService);
  private roomService = inject(RoomService);
  private searchGuesthouseService = inject(SearchGuesthouseService);
  activeModal = inject(NgbActiveModal);

  @Input() selectedroomId!: number;
  @Input() roomName!: string;

  minDate!: NgbDateStruct;
  bookedDates: string[] = [];
  datepickerReady = false;

  form = new FormGroup({
    bookFrom: new FormControl<NgbDateStruct | null>(null, Validators.required),
    bookTo: new FormControl<NgbDateStruct | null>(null, Validators.required),
  });

  ngOnInit() {
    this.minDate = this.searchGuesthouseService.minSelectableDate;
    this.loadBookedDates();
  }

  private loadBookedDates() {
    this.datepickerReady = false;
    this.bookingService.getBookingsPerRoom(this.selectedroomId).subscribe({
      next: (bookings) => {
        console.log('API response:', bookings);
        this.bookedDates = [];
        this.mapBookingsToDisabledDates(bookings);
        console.log('all bookedDates:', this.bookedDates);

        this.datepickerReady = true;
      },
      error: () => console.error('Failed to load booked dates'),
    });
  }

  private mapBookingsToDisabledDates(bookings: BookedDateResponse[]) {
    bookings.forEach(({ bookFrom, bookTo }) => {
      console.log(' bookingFrom:', bookFrom);
      console.log(' bookingTo :', bookTo);
      let startDate = this.searchGuesthouseService.dateOnly(bookFrom);
      const endDate = this.searchGuesthouseService.dateOnly(bookTo);

      while (startDate < endDate) {
        const calendarDay = this.searchGuesthouseService.formatDate(startDate);

        if (!this.bookedDates.includes(calendarDay)) {
          this.bookedDates.push(calendarDay);
        }

        startDate.setDate(startDate.getDate() + 1);
      }
    });
  }

  markDisabled = (date: NgbDateStruct) => {
    const currentDate = this.searchGuesthouseService.ngbDateKey(date);
    const firstAvailableDate = this.searchGuesthouseService.ngbDateKey(this.minDate);

    return currentDate < firstAvailableDate || this.bookedDates.includes(currentDate);
  };

  confirmBooking() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const from = this.form.value.bookFrom!;
    const to = this.form.value.bookTo!;

    if (this.hasOverlap(from, to)) {
      alert('Selected dates overlap an existing booking.');
      return;
    }
    // const booking: roomBooking = {
    //   roomId: this.selectedroomId,
    //   bookFrom: this.ngbDateKey(this.form.value.bookFrom!),
    //   bookTo: this.ngbDateKey(this.form.value.bookTo!),
    // };
    const booking: roomBooking = {
      roomId: this.selectedroomId,
      bookFrom: this.searchGuesthouseService.ngbDateKey(from),
      bookTo: this.searchGuesthouseService.ngbDateKey(to),
    };

    this.roomService.bookRoom(booking).subscribe({
      next: () => {
        this.loadBookedDates();

        this.activeModal.close('saved');
      },
      error: () => alert('Failed to book room'),
    });
  }

  private hasOverlap(from: NgbDateStruct, to: NgbDateStruct): boolean {
    let current = this.searchGuesthouseService.ngbDateKey(from);
    const end = this.searchGuesthouseService.ngbDateKey(to);

    while (current < end) {
      if (this.bookedDates.includes(current)) {
        return true;
      }

      const [y, m, d] = current.split('-').map(Number);
      const next = new Date(y, m - 1, d);
      next.setDate(next.getDate() + 1);
      current = this.searchGuesthouseService.formatDate(next);
    }

    return false;
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  //convert jsDate to ngbdatestruct
  // private setMinDateToday() {
  //   const today = new Date();
  //   this.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  // }

  //convert dates from backend as calendar days only without timestamp (to seperate the range between booked dates)
  // private dateOnly(dateStr: string) {
  //   const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
  //   return new Date(y, m - 1, d);
  // }

  //convert date to string by storing dates without timezone
  // private formatDate(date: Date) {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  //convert NgbDateStruct to string
  // private ngbDateKey(date: NgbDateStruct) {
  //   const y = date.year;
  //   const m = String(date.month).padStart(2, '0');
  //   const d = String(date.day).padStart(2, '0');
  //   return `${y}-${m}-${d}`;
  // }
}
