import { Amenities } from '../../../shared-model/enum';

export interface CreateRoomModel {
  name: string;
  description: string;
  image: string;
  price: number;
  numberOfBeds: number;
  guesthouseId: number;
  amenities: Amenities[];
}
