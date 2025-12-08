import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, ResponseBody } from './auth.model/login.model';
import { RegisterRequest } from './auth.model/register.model';
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

  registerUser(data: RegisterRequest): Observable<ResponseBody> {
    return this.http
      .post<ResponseBody>(
        `${environment.apiUrl}${environment.endpoints.authentication.register}`,
        data
      )
      .pipe(
        tap((res) => {
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
}
