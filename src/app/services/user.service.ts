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
    return this.http.post<any>(`${this.API}/auth/registro`, userData).pipe(
      tap((response: any) => {
        console.log('Usuario creado:', response.usuario.id);
      })
    );
  }

  existsUser(username: string) {
    return this.http.get<any>(`${this.API}/usuarios/${username}`).pipe(
      tap((response: any) => {
        console.log('Usuario existe:', response.exists);
      })
    );
  }

  /**
   * Asegura que exista un usuario con el username dado.
   * - Si existe (200 OK), extrae su id desde response.usuario.id y lo guarda en `userid`.
   * - Si no existe (404), crea el usuario con `userData`, extrae el id y lo guarda.
   * Devuelve un observable con el id (o null en caso de fallo).
   */
  ensureUser(username: string, userData: any): Observable<number | null> {
    return this.existsUser(username).pipe(
      switchMap((response: any) => {
        // Si el endpoint devuelve el usuario existente
        if (response && response.usuario) {
          const id = response.usuario.id ?? null;
          if (id) {
            this.userid.set(id);
            console.log('Usuario existente encontrado, id:', id);
            return of(id);
          }
        }
        // Si llegamos aquí sin id, algo falló
        console.warn('existsUser devolvió respuesta sin usuario.id');
        return of(null);
      }),
      catchError(err => {
        // Si es 404 (usuario no existe), crear usuario
        if (err.status === 404) {
          console.log('Usuario no existe (404), creando...');
          return this.createUser(userData).pipe(
            map((resp: any) => {
              const newId = resp?.usuario?.id ?? resp?.id ?? null;
              if (newId) {
                this.userid.set(newId);
                console.log('Usuario creado con id:', newId);
              }
              return newId;
            }),
            catchError(createErr => {
              console.error('Error creando usuario:', createErr);
              return of(null);
            })
          );
        }
        // Otro error (red, permisos, etc.)
        console.error('Error comprobando existencia de usuario:', err);
        return of(null);
      })
    );
  }
}