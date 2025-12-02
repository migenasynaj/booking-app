import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUser() {
    return this.http.get(`${environment.apiUrl}${environment.endpoints.users.getAll}`);
  }

  getUserById(id: number) {
    return this.http.get(`${environment.apiUrl}${environment.endpoints.users.getById(id)}`);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${environment.apiUrl}${environment.endpoints.users.update(id)}`, data);
  }
}
