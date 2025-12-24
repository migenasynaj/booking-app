import { Component, EventEmitter, inject, Output } from '@angular/core';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchGuesthouses } from '../guesthouses.model';
import { SearchGuesthouse } from '../search-guesthouse/search-guesthouse';

@Component({
  selector: 'app-guesthouse-list',
  imports: [RouterLink, SearchGuesthouse],
  templateUrl: './guesthouse-list.html',
  styleUrl: './guesthouse-list.css',
})
export class GuesthouseList {
  private guesthouseService = inject(GuesthouseService);
  private destroy$ = new Subject<void>();
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private apiSub?: Subscription;

  error: string | null = null;
  loading = false;
  noAvailableGuesthouses = false;

  currentPage = 1;
  guesthousesPerPage = 6;
  allGuesthouses!: Guesthouse[];
  displayedGuesthouses!: Guesthouse[];

  ngOnInit() {
    this.activateRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      console.log(' RAW query params:', params);

      this.loading = true;
      this.error = null;
      this.noAvailableGuesthouses = false;

      let searchParams: SearchGuesthouses | undefined = undefined;

      const hasParams: boolean =
        !!params['checkIn'] || !!params['checkOut'] || !!params['numberOfBeds'];

      if (hasParams) {
        searchParams = {
          checkIn: params['checkIn'],
          checkOut: params['checkOut'],
          numberOfBeds: Number(params['numberOfBeds']),
        };

        console.log(' searchParams sent to API:', searchParams);
      }

      this.apiSub?.unsubscribe();

      this.apiSub = this.guesthouseService.getGuesthouse(searchParams).subscribe({
        next: (data) => {
          console.log(' API RESPONSE (guesthouses):', data);
          this.allGuesthouses = data;
          console.log(this.allGuesthouses);
          this.loading = false;

          if (data.length === 0) {
            this.error = null;
            this.noAvailableGuesthouses = true;
            this.displayedGuesthouses = [];
            return;
          }

          this.updateDisplayedGuesthouses();
        },
        error: (err) => {
          console.error('error', err);
          this.error = 'Failed to load guesthouses';
          this.loading = false;
        },
      });
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

  updateDisplayedGuesthouses() {
    const firstGuesthouse = (this.currentPage - 1) * this.guesthousesPerPage;
    const lastGuesthouse = firstGuesthouse + this.guesthousesPerPage;

    this.displayedGuesthouses = this.allGuesthouses.slice(firstGuesthouse, lastGuesthouse);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedGuesthouses();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedGuesthouses();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedGuesthouses();
    }
  }

  get totalPages() {
    return Math.ceil(this.allGuesthouses?.length / this.guesthousesPerPage);
  }

  get pages() {
    const result = [];
    for (let number = 1; number <= this.totalPages; number++) {
      result.push(number);
    }
    return result;
  }

  ngOnDestroy(): void {
    this.apiSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
