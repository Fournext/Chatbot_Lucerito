import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductService{
  private http = inject(HttpClient);
  private API = environment.apiUrl;

  public listarProductos = signal<productos[]>([]);

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.API}/productos/`).pipe(
      tap((response: any) => {
        this.listarProductos.set(response.productos || []);
      })
    );
  }
}
