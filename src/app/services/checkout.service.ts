import { Injectable } from '@angular/core';
import { PaymentData } from '../../interface/paymentdata';
import { ShippingData } from '../../interface/envio';

export type PaymentMethod = 'tarjeta' | 'qr' | '';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  shipping: ShippingData = {};
  payment: PaymentData = {};
  paymentMethod: PaymentMethod = ''; // 👈 Nuevo campo para tipo de pago

  setShipping(data: ShippingData) {
    this.shipping = { ...this.shipping, ...data };
  }

  setPayment(data: PaymentData) {
    this.payment = { ...this.payment, ...data };
  }

  // 👇 Nuevos métodos para manejar el tipo de pago
  setPaymentMethod(method: PaymentMethod) {
    this.paymentMethod = method;
  }

  getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  clear() {
    this.shipping = {};
    this.payment = {};
    this.paymentMethod = '';
  }
}
