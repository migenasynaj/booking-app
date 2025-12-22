import { Component, inject } from '@angular/core';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';
import { Subject, takeUntil } from 'rxjs';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchGuesthouses } from '../guesthouses.model';
// import { SearchGuesthouse } from '../search-guesthouse/search-guesthouse';

@Component({
  selector: 'app-guesthouse-list',
  imports: [RouterLink],
  templateUrl: './guesthouse-list.html',
  styleUrl: './guesthouse-list.css',
})
export class GuesthouseList {
  private guesthouseService = inject(GuesthouseService);
  private destroy$ = new Subject<void>();
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);

  error: string | null = null;
  loading = true;

  currentPage = 1;
  guesthousesPerPage = 6;
  allGuesthouses!: Guesthouse[];
  displayedGuesthouses!: Guesthouse[];

  ngOnInit() {
    this.activateRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      console.log(' RAW query params:', params);

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

      this.guesthouseService.getGuesthouse(searchParams).subscribe({
        next: (data) => {
          console.log(' API RESPONSE (guesthouses):', data);
          this.allGuesthouses = data;
          console.log(this.allGuesthouses);
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

  // showAvailableGuesthouses(searchParams: SearchGuesthouses): void {
  //   this.router.navigate(['/user/guesthouses'], {
  //     queryParams: {
  //       checkIn: searchParams.checkIn,
  //       checkOut: searchParams.checkOut,
  //       numberOfBeds: searchParams.numberOfBeds,
  //     },
  //   });
  // }

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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
