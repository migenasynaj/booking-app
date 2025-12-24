import { Component, inject } from '@angular/core';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';
import { Subject, takeUntil } from 'rxjs';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { Router } from '@angular/router';
import { SearchGuesthouse } from '../search-guesthouse/search-guesthouse';
import { SearchGuesthouses } from '../guesthouses.model';

@Component({
  selector: 'app-top-guesthouses',
  imports: [SearchGuesthouse],
  templateUrl: './top-guesthouses.html',
  styleUrl: './top-guesthouses.css',
})
export class TopGuesthouses {
  private guesthouseService = inject(GuesthouseService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  guesthouse!: Guesthouse[];
  error: string | null = null;
  loading = true;

  ngOnInit() {
    this.guesthouseService
      .getTopFive()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.guesthouse = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load guesthouses';
          this.loading = false;
        },
      });
  }

  showAvailableGuesthouses(searchParams: SearchGuesthouses): void {
    this.loading = true;
    this.router.navigate(['/user/guesthouses'], {
      queryParams: {
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        numberOfBeds: searchParams.numberOfBeds,
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
