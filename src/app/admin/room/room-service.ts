import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRoomModel, Room } from './r-model/room-list.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private http = inject(HttpClient);

  getRoomsByGuesthouseId(guesthouseId: number): Observable<Room[]> {
    return this.http.get<Room[]>(
      `${environment.apiUrl}${environment.endpoints.room.getByGuesthouseId(guesthouseId)}`
    );
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${environment.apiUrl}${environment.endpoints.room.getById(id)}`);
  }

  createRoom(data: CreateRoomModel) {
    return this.http.post<Room>(`${environment.apiUrl}${environment.endpoints.room.create}`, data);
  }

  updateRoom(id: number, data: Room) {
    return this.http.put<Room>(
      `${environment.apiUrl}${environment.endpoints.room.update(id)}`,
      data
    );
  }

  deleteRoomById(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}${environment.endpoints.room.delete(id)}`);
  }
}
