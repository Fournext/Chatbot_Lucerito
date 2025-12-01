import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private API = environment.apiUrl;

  public userid = signal<number | null>(null);

  createUser(userData: any) {
    return this.http.post<any>(`${this.API}/user-telegram/`, userData).pipe(
      tap((response: any) => {
        this.userid.set(response.user.id);
        console.log('Usuario creado:', response.user.id);
      })
    );
  }

}