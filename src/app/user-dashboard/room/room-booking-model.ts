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
