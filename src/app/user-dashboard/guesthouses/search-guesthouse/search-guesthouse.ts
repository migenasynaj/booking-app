import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchGuesthouses } from '../guesthouses.model';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SearchGuesthouseService } from '../../../shared-services/search-guesthouse-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-guesthouse',
  imports: [ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './search-guesthouse.html',
  styleUrl: './search-guesthouse.css',
})
export class SearchGuesthouse {
  private searchGuesthouseService = inject(SearchGuesthouseService);
  private route = inject(ActivatedRoute);

  @Output() searchAvailableGuesthouses = new EventEmitter<SearchGuesthouses>();
  minDate!: NgbDateStruct;
  loading = false;

  @Input() set isLoading(value: boolean) {
    this.loading = value;
  }

  form = new FormGroup({
    checkIn: new FormControl<NgbDateStruct | null>(null, Validators.required),
    checkOut: new FormControl<NgbDateStruct | null>(null, Validators.required),
    numberOfBeds: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  get NumberOfBeds() {
    return this.form.controls.numberOfBeds.touched && this.form.controls.numberOfBeds.invalid;
  }

  ngOnInit() {
    this.minDate = this.searchGuesthouseService.minSelectableDate;
    this.route.queryParams.subscribe((params) => {
      this.restoreSearchState(params);
    });
  }
  showGuesthouses() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const values: SearchGuesthouses = {
      checkIn: this.searchGuesthouseService.ngbDateKey(this.form.value.checkIn!),
      checkOut: this.searchGuesthouseService.ngbDateKey(this.form.value.checkOut!),
      numberOfBeds: this.form.value.numberOfBeds!,
    };

    console.log(values);

    this.searchAvailableGuesthouses.emit(values);
  }

  restoreSearchState(state: Partial<SearchGuesthouses>) {
    if (!state) return;

    this.form.patchValue({
      checkIn: state.checkIn ? this.searchGuesthouseService.keyToNgbDate(state.checkIn) : null,

      checkOut: state.checkOut ? this.searchGuesthouseService.keyToNgbDate(state.checkOut) : null,

      numberOfBeds: state.numberOfBeds ?? 1,
    });
  }
}
