import { Injectable } from '@angular/core';
import { ResponseBody } from '../authentication/auth.model/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as ResponseBody) : null;
  }

  getUserId() {
    return this.getCurrentUser()?.id ?? null;
  }

  getUsername() {
    return this.getCurrentUser()?.username ?? null;
  }
}
