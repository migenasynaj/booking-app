import { Amenities } from './enum';

export interface Room {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  numberOfBeds: number;
  guestHouseId: number;
  amenities: Amenities[];
}
