import { Room } from '../../shared-model/room-list.model';

export interface roomBooking {
  roomId: number;
  bookFrom: string;
  bookTo: string;
}

export interface BookedDateResponse {
  id: number;
  roomId: number;
  bookFrom: string;
  bookTo: string;
}

export interface BookingDetails {
  id: number;
  roomId: number;
  bookFrom: string;
  bookTo: string;
  room: Room;
}
