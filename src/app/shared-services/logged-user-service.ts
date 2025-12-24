import { Injectable } from '@angular/core';
import { ResponseBody } from '../authentication/auth.model/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  getCurrentUser(): ResponseBody | null {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as ResponseBody) : null;
  }

  getUserId(): string | null {
    return this.getCurrentUser()?.id ?? null;
  }

  getUsername(): string | null {
    return this.getCurrentUser()?.username ?? null;
  }
}
