import { Injectable } from '@angular/core';
import { PaymentData } from '../../interface/paymentdata';
import { ShippingData } from '../../interface/envio';


@Injectable({ providedIn: 'root' })
export class CheckoutService {
  shipping: ShippingData = {};
  payment: PaymentData = {};

  setShipping(data: ShippingData) {
    this.shipping = { ...this.shipping, ...data };
  }

  setPayment(data: PaymentData) {
    this.payment = { ...this.payment, ...data };
  }

  clear() {
    this.shipping = {};
    this.payment = {};
  }
}
