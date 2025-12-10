import { Component, inject } from '@angular/core';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';
import { Subject, takeUntil } from 'rxjs';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-guesthouse-list',
  imports: [RouterLink],
  templateUrl: './guesthouse-list.html',
  styleUrl: './guesthouse-list.css',
})
export class GuesthouseList {
  private guesthouseService = inject(GuesthouseService);
  private destroy$ = new Subject<void>();
  error: string | null = null;
  loading = true;
  guesthouse!: Guesthouse[];

  ngOnInit() {
    this.guesthouseService
      .getGuesthouse()
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
