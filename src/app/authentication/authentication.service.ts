import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, ResponseBody } from './auth.model/login.model';
import { RegisterRequest, RegisterResponse } from './auth.model/register.model';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);

  loginUser(data: LoginRequest): Observable<ResponseBody> {
    return this.http
      .post<ResponseBody>(
        `${environment.apiUrl}${environment.endpoints.authentication.login}`,
        data
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res));
        })
      );
  }

  registerUser(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        `${environment.apiUrl}${environment.endpoints.authentication.register}`,
        data
      )
      .pipe(
        tap((res) => {
          if (!res.role) res.role = 'User';

          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      const exp = decoded.exp;
      if (!exp) return true;

      const isExpired = Date.now() > exp * 1000;

      return isExpired;
    } catch (err) {
      return true;
    }
  }
}
