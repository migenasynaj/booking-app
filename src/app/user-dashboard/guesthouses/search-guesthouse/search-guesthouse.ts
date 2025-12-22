import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchGuesthouses } from '../guesthouses.model';

@Component({
  selector: 'app-search-guesthouse',
  imports: [ReactiveFormsModule],
  templateUrl: './search-guesthouse.html',
  styleUrl: './search-guesthouse.css',
})
export class SearchGuesthouse {
  @Output() searchAvailableGuesthouses = new EventEmitter<SearchGuesthouses>();

  form = new FormGroup({
    checkIn: new FormControl<string>('', Validators.required),
    checkOut: new FormControl<string>('', Validators.required),
    numberOfBeds: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  get NumberOfBeds() {
    return this.form.controls.numberOfBeds.touched && this.form.controls.numberOfBeds.invalid;
  }

  showAvailableGuesthouses() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const values: SearchGuesthouses = {
      checkIn: this.form.value.checkIn!,
      checkOut: this.form.value.checkOut!,
      numberOfBeds: this.form.value.numberOfBeds!,
    };

    this.searchAvailableGuesthouses.emit(values);
  }
}
