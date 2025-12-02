import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Guesthouse, GuesthouseCreateModel } from './g-model/guesthouse.model';

@Injectable({
  providedIn: 'root',
})
export class GuesthouseService {
  private http = inject(HttpClient);

  getGuesthouse() {
    console.log(`${environment.apiUrl}${environment.endpoints.guesthouse.getAll}`);
    return this.http.get<Guesthouse[]>(
      `${environment.apiUrl}${environment.endpoints.guesthouse.getAll}`
    );
  }

  getGuesthouseById(id: number) {
    return this.http.get<Guesthouse>(
      `${environment.apiUrl}${environment.endpoints.guesthouse.getById(id)}`
    );
  }

  createGuesthouse(data: GuesthouseCreateModel) {
    return this.http.post<Guesthouse>(
      `${environment.apiUrl}${environment.endpoints.guesthouse.create}`,
      data
    );
  }

  updateGuesthouse(id: number, data: Guesthouse) {
    return this.http.put<Guesthouse>(
      `${environment.apiUrl}${environment.endpoints.guesthouse.update(id)}`,
      data
    );
  }

  deleteGuesthouseById(id: number) {
    return this.http.delete<void>(
      `${environment.apiUrl}${environment.endpoints.guesthouse.delete(id)}`
    );
  }
}
