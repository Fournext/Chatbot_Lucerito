import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-form-datos-envio',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-datos-envio.html',
  styleUrl: './form-datos-envio.css',
})
export class FormDatosEnvio {
  constructor(private router: Router, private checkout: CheckoutService) {
    // preload form with any saved shipping data
    if (this.checkout.shipping) {
      this.formData = { ...this.formData, ...this.checkout.shipping };
      // set telefonoInput if exists without the +591 prefix
      if (this.formData.telefono && this.formData.telefono.startsWith('591')) {
        this.telefonoInput = this.formData.telefono.replace(/^591/, '');
      }
    }
  }

  // Control del modal
  showPaymentModal: boolean = false;

  formData = {
    direccion1: '',
    direccion2: '',
    ciudad: '',
    region: '',
    nombreCompleto: '',
    telefono: '591',
    guardarDatos: true,
    comentario: ''
  };

  // Campo auxiliar para solo el número sin 591
  telefonoInput: string = '';
  telefonoError: string | null = null;

  // Métodos para el modal
  openPaymentModal(): void {
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  selectQRPayment(): void {
    // Guarda los datos de envío y redirige a pago-qr
    this.checkout.setPaymentMethod('qr');
    this.checkout.setShipping(this.formData);
    this.closePaymentModal();
    this.router.navigate(['/caja']);
  }

  selectCardPayment(): void {
    // Guarda los datos de envío y redirige a datos-tarjeta
    this.checkout.setPaymentMethod('tarjeta');
    this.checkout.setShipping(this.formData);
    this.closePaymentModal();
    this.router.navigate(['/datos-tarjeta']);
  }

  onTelefonoChange(value: string) {
    this.telefonoInput = value.replace(/\s+/g, '');
    this.validateTelefonoInput();
  }

  validateTelefonoInput(): boolean {
    const v = (this.telefonoInput || '').replace(/\D/g, '');
    // aceptar solamente números y longitud 7 u 8 (números válidos en Bolivia)
    if (!v) {
      this.telefonoError = 'El teléfono es requerido';
      this.formData.telefono = '';
      return false;
    }
    if (!/^\d+$/.test(v)) {
      this.telefonoError = 'Solo se permiten dígitos';
      this.formData.telefono = '';
      return false;
    }
    if (v.length < 7 || v.length > 8) {
      this.telefonoError = 'El número debe tener 7 u 8 dígitos';
      this.formData.telefono = '';
      return false;
    }
    // Si pasa validación, actualizar formData con el código de país
    this.telefonoError = null;
    this.formData.telefono = '591' + v;
    return true;
  }

  isTelefonoValid(): boolean {
    return this.telefonoError === null && !!this.formData.telefono;
  }

  toggleGuardar() {
    this.formData.guardarDatos = !this.formData.guardarDatos;
  }

  // Este método ya no se usa desde el template, pero lo mantengo por si acaso
  handleSubmit() {
    // Ahora este método abre el modal en lugar de navegar directamente
    this.openPaymentModal();
  }

  guardar() {
    // Método existente - mantener por compatibilidad
  }

  goBack() {
    try {
      if (history.length > 1) {
        history.back();
      } else {
        this.router.navigate(['/order']);
      }
    } catch (e) {
      this.router.navigate(['/order']);
    }
  }
}