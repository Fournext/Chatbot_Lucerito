import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { ShippingData } from '../../interface/envio';

@Injectable({
  providedIn: 'root',
})
export class SendPaymentService {
  private http = inject(HttpClient);
  private API = environment.apiUrl;

  public ordercod = signal<number | null>(null);

  createOrder(orderData: any) {
    return this.http.post<any>(`${this.API}/orden/crear-con-asignacion`, orderData).pipe(
      tap((response: any) => {
        this.ordercod.set(response.orden.cod ?? null);
      }) 
    );
  }

  createDetailOrder(detailData: any, ordercod: number) {
    return this.http.post<any>(`${this.API}/orden/${ordercod}/agregar-detalle`, detailData).pipe(
      tap((response: any) => {
        //console.log('Detalle de orden creado:', response);
      }) 
    );
  }

  createShipping(shippingData: ShippingData, ordercod: number) {
    return this.http.post<any>(`${this.API}/datos-envio/`, shippingData).pipe(
      tap((response: any) => {
        //console.log('Envio de orden creado:', response);
      }) 
    );
  }          
}