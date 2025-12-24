import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class SearchGuesthouseService {
  minSelectableDate!: NgbDateStruct;

  //convert jsDate to ngbdatestruct
  constructor() {
    const today = new Date();
    this.minSelectableDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  //convert dates from backend as calendar days only without timestamp (to seperate the range between booked dates)
  dateOnly(dateStr: string) {
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  //convert date to string by storing dates without timezone
  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //convert NgbDateStruct to string
  ngbDateKey(date: NgbDateStruct) {
    const y = date.year;
    const m = String(date.month).padStart(2, '0');
    const d = String(date.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  //convert string to NgbDateStruct
  keyToNgbDate(dateKey: string): NgbDateStruct {
    const [year, month, day] = dateKey.split('-').map(Number);
    return { year, month, day };
  }
}
