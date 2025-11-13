import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../services/checkout.service';


@Component({
  selector: 'app-datos-tarjeta',
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-tarjeta.html',
  styleUrl: './datos-tarjeta.css',
})
export class DatosTarjeta {
  constructor(private router: Router, private checkout: CheckoutService) {
    if (this.checkout.payment) {
      this.formData = { ...this.formData, ...this.checkout.payment };
    }
  }
  formData = {
    numeroTarjeta: '',
    fechaExp: '',
    nombreTarjeta: '',
    cvv: '',
    pais: '',
    codigoPostal: '',
    guardar: false
  };

  // --- Validation helpers ---
  private normalizeCardNumber(num: string) {
    return (num || '').replace(/[^0-9]/g, '');
  }

  private luhnCheck(cardNumber: string) {
    const s = this.normalizeCardNumber(cardNumber);
    let sum = 0;
    let shouldDouble = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let digit = parseInt(s.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return s.length >= 13 && s.length <= 19 && sum % 10 === 0;
  }

  get numeroTarjetaError(): string | null {
    const v = this.formData.numeroTarjeta || '';
    if (!v) return 'El número de tarjeta es requerido.';
    if (!/^[0-9 \-]+$/.test(v)) return 'Sólo dígitos, espacios o guiones permitidos.';
    if (!this.luhnCheck(v)) return 'Número de tarjeta inválido.';
    return null;
  }

  get nombreTarjetaError(): string | null {
    if (!this.formData.nombreTarjeta || this.formData.nombreTarjeta.trim().length === 0) {
      return 'El nombre en la tarjeta es requerido.';
    }
    return null;
  }

  get cvvError(): string | null {
    const v = (this.formData.cvv || '').replace(/\s+/g, '');
    if (!v) return 'El CVV es requerido.';
    if (!/^\d{3,4}$/.test(v)) return 'El CVV debe tener 3 o 4 dígitos.';
    return null;
  }

  get fechaExpError(): string | null {
    const v = (this.formData.fechaExp || '').trim();
    if (!v) return 'La fecha de expiración es requerida.';
    // Accept MM/YY or MM/AA or MM/YYYY
    const m = v.match(/^(0?[1-9]|1[0-2])[\/]?([0-9]{2}|[0-9]{4})$/);
    if (!m) return 'Formato inválido. Use MM/AA.';
    const month = parseInt(m[1], 10);
    let year = parseInt(m[2], 10);
    if (m[2].length === 2) {
      // assume 20xx for 2-digit years
      const prefix = Math.floor(new Date().getFullYear() / 100) * 100;
      year = prefix + year;
      // if year is more than 10 years in the past, bring it to next century (edge cases)
    }
    // set to last millisecond of month
    const exp = new Date(year, month, 0, 23, 59, 59, 999);
    const now = new Date();
    if (exp < now) return 'La tarjeta está vencida.';
    return null;
  }

  get paisError(): string | null {
    if (!this.formData.pais || this.formData.pais.trim().length === 0) return 'El país es requerido.';
    return null;
  }

  get codigoPostalError(): string | null {
    if (!this.formData.codigoPostal || this.formData.codigoPostal.trim().length === 0) return 'El código postal es requerido.';
    // optional: basic check
    if (!/^\w{2,10}$/.test(this.formData.codigoPostal)) return 'Código postal inválido.';
    return null;
  }

  get isFormValid(): boolean {
    return !this.numeroTarjetaError && !this.fechaExpError && !this.nombreTarjetaError && !this.cvvError && !this.paisError && !this.codigoPostalError;
  }

  handleSubmit() {
    if (!this.isFormValid) return;
    // save payment data and navigate to caja
    this.checkout.setPayment(this.formData);
    this.router.navigate(['/caja']);
  }

  goBack() {
    try {
      if (history.length > 1) {
        history.back();
      } else {
        this.router.navigate(['/datos-envio']);
      }
    } catch (e) {
      this.router.navigate(['/datos-envio']);
    }
  }

  toggleGuardar() {
    this.formData.guardar = !this.formData.guardar;
  }

  // --- Input formatting handlers ---
  onCardNumberInput(e: any) {
    const input = e.target as HTMLInputElement;
    const digits = this.normalizeCardNumber(input.value).slice(0, 19); // max 19 digits
    const parts = digits.match(/.{1,4}/g) || [];
    const formatted = parts.join(' ');
    this.formData.numeroTarjeta = formatted;
    input.value = formatted;
  }

  onFechaInput(e: any) {
    const input = e.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 4); // MMYY
    if (digits.length <= 2) {
      input.value = digits;
      this.formData.fechaExp = digits;
      return;
    }
    input.value = digits.slice(0, 2) + '/' + digits.slice(2);
    this.formData.fechaExp = input.value;
  }

  onCvvInput(e: any) {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = digits;
    this.formData.cvv = digits;
  }

  // helper (not currently used elsewhere but handy)
  formatCardNumber(value: string) {
    const s = this.normalizeCardNumber(value).slice(0, 19);
    return (s.match(/.{1,4}/g) || []).join(' ');
  }
}
