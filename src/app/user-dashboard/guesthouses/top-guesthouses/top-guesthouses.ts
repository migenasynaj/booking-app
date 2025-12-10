import { Component, inject } from '@angular/core';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';
import { Subject, takeUntil } from 'rxjs';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-guesthouses',
  imports: [RouterLink],
  templateUrl: './top-guesthouses.html',
  styleUrl: './top-guesthouses.css',
})
export class TopGuesthouses {
  private guesthouseService = inject(GuesthouseService);
  private destroy$ = new Subject<void>();
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
        },
        error: () => {
          this.error = 'Failed to load guesthouses';
          this.loading = false;
        },
      });
  }

  onShowAll() {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
