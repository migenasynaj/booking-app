import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guesthouse } from '../../../shared-model/guesthouse.model';
import { RoomDetails } from '../room-details/room-details';
import { Subject, takeUntil } from 'rxjs';
import { Room } from '../r-model/room-list.model';
import { Amenities } from '../enum';
import { GuesthouseService } from '../../../shared-services/guesthouse-service';
import { RoomService } from '../../../shared-services/room-service';

@Component({
  selector: 'app-room-list',
  imports: [],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
})
export class RoomList {
  private modalService = inject(NgbModal);
  private guesthouseService = inject(GuesthouseService);
  private roomService = inject(RoomService);
  private destroy$ = new Subject<void>();

  guesthouses!: Guesthouse[];
  rooms: Room[] = [];
  selectedGuesthouseId: number | null = null;
  selectedGuesthouseName: string | null = null;

  loading = true;
  error: string | null = null;
  successMessage: string | null = null;
  roomsLoading = false;

  ngOnInit() {
    this.guesthouseService
      .getGuesthouse()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.guesthouses = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load guesthouses.';
          this.loading = false;
        },
      });
  }

  loadRooms(guesthouseId: number, guesthouseName: string) {
    this.selectedGuesthouseId = guesthouseId;
    this.selectedGuesthouseName = guesthouseName;

    this.roomsLoading = true;
    this.roomService
      .getRoomsByGuesthouseId(guesthouseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => {
          this.rooms = rooms;
          this.roomsLoading = false;
        },
        error: () => {
          this.error = 'Failed to load rooms';
          this.roomsLoading = false;
        },
      });
  }

  hideSuccessMessage() {
    setTimeout(() => (this.successMessage = null), 3000);
  }

  getAmenityName(a: number): string {
    return Amenities[a];
  }

  onCreate() {
    const modalRef = this.modalService.open(RoomDetails, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.guesthouseId = this.selectedGuesthouseId;
    modalRef.componentInstance.guesthouseName = this.selectedGuesthouseName;

    modalRef.closed.subscribe((result) => {
      if (result === 'created') {
        this.successMessage = 'Room created successfully!';
        this.hideSuccessMessage();
        this.loadRooms(this.selectedGuesthouseId!, this.selectedGuesthouseName!);
      }
    });
  }

  onEdit(room: Room) {
    const modalRef = this.modalService.open(RoomDetails, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.roomId = room.id;
    modalRef.componentInstance.guesthouseId = room.guestHouseId;
    modalRef.componentInstance.guesthouseName = this.selectedGuesthouseName;

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.successMessage = 'Room updated successfully!';
        this.hideSuccessMessage();
        this.loadRooms(this.selectedGuesthouseId!, this.selectedGuesthouseName!);
      }
    });
  }

  onDelete(room: Room) {
    const modalRef = this.modalService.open(RoomDetails, {
      size: 'md',
      centered: true,
    });

    modalRef.componentInstance.mode = 'delete';
    modalRef.componentInstance.roomId = room.id;
    modalRef.componentInstance.roomName = room.name;
    modalRef.componentInstance.guesthouseName = this.selectedGuesthouseName;

    modalRef.closed.subscribe((result) => {
      if (result === 'deleted') {
        this.successMessage = 'Room deleted successfully!';
        this.hideSuccessMessage();
        this.loadRooms(this.selectedGuesthouseId!, this.selectedGuesthouseName!);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
