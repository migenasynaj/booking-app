import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GuesthouseDetails } from '../guesthouse-details/guesthouse-details';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';

@Component({
  selector: 'app-guesthouse-list',
  imports: [],
  templateUrl: './guesthouse-list.html',
  styleUrl: './guesthouse-list.css',
})
export class GuesthouseList {
  guesthouseService = inject(GuesthouseService);
  private destroy$ = new Subject<void>();
  private modalService = inject(NgbModal);

  guesthouses!: Guesthouse[];
  error: string | null = null;
  loading = true;
  successMessage: string | null = null;
  private authService = inject(AuthenticationService);

  ngOnInit() {
    this.guesthouseService
      .getGuesthouse()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.guesthouses = data;
        },
        error: () => {
          this.error = 'Failed to load guesthouses. Please try again later.';
          this.loading = false;
        },
      });
  }

  hideSuccessMessage() {
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  onEdit(gh: Guesthouse) {
    const modalRef = this.modalService.open(GuesthouseDetails, {
      size: 'lg', // size of the modal window
      centered: true, //Modal will be centered vertically
    });

    modalRef.componentInstance.guesthouseId = gh.id;
    modalRef.componentInstance.mode = 'edit';

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.successMessage = 'Guesthouse updated successfully!';
        this.ngOnInit();
        this.hideSuccessMessage();
      }
    });
  }

  onDelete(gh: Guesthouse) {
    const modalRef = this.modalService.open(GuesthouseDetails, {
      size: 'md', // size of the modal window
      centered: true, //Modal will be centered vertically
    });

    modalRef.componentInstance.guesthouseId = gh.id;
    modalRef.componentInstance.guesthouseName = gh.name;
    modalRef.componentInstance.mode = 'delete';

    modalRef.closed.subscribe((result) => {
      if (result === 'deleted') {
        this.successMessage = 'Guesthouse deleted successfully!';
        this.ngOnInit();
        this.hideSuccessMessage();
      }
    });
  }

  onCreate() {
    const modalRef = this.modalService.open(GuesthouseDetails, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.mode = 'create';

    modalRef.closed.subscribe((result) => {
      if (result === 'created') {
        this.successMessage = 'Guesthouse created successfully!';
        this.ngOnInit();
        this.hideSuccessMessage();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
