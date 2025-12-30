import { Component, inject, Input } from '@angular/core';
import { RoomService } from '../../../shared-services/room-service';
import { Subject, takeUntil } from 'rxjs';
import { Room } from '../../../shared-model/room-list.model';
import { ActivatedRoute } from '@angular/router';
import { Amenities } from '../../../shared-model/enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomBooking } from '../room-booking/room-booking';

@Component({
  selector: 'app-room-list',
  imports: [],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
})
export class RoomList {
  private roomService = inject(RoomService);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);

  error: string | null = null;
  loading = true;
  room!: Room[];
  successMessage: string | null = null;

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('guesthouseId');

      this.roomService.getRoomsByGuesthouseId(Number(id)).subscribe({
        next: (rooms) => {
          this.room = rooms;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load rooms.';
          this.loading = false;
        },
      });
    });
  }

  getAmenityName(a: number): string {
    return Amenities[a];
  }
  hideSuccessMessage() {
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  onBookRoom(room: Room) {
    const modalRef = this.modalService.open(RoomBooking, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.roomName = room.name;
    modalRef.componentInstance.selectedroomId = room.id;

    modalRef.closed.subscribe((result) => {
      if (result === 'saved') {
        this.successMessage = 'Room booked successfully!';
        this.hideSuccessMessage();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
