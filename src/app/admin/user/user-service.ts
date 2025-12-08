import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from './u-model/user-list.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUser() {
    return this.http.get<User[]>(`${environment.apiUrl}${environment.endpoints.users.getAll}`);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}${environment.endpoints.users.getById(id)}`);
  }

  updateUser(id: string, data: User) {
    return this.http.put<User>(
      `${environment.apiUrl}${environment.endpoints.users.update(id)}`,
      data
    );
  }
}
