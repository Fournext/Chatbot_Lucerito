import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CheckoutService, PaymentMethod } from '../services/checkout.service';

@Component({
  selector: 'app-caja',
  imports: [CommonModule],
  templateUrl: './caja.html',
  styleUrl: './caja.css',
})
export class Caja implements OnInit {
  showPopup = false;
  paymentMethod: PaymentMethod = '';

  constructor(
    private router: Router, 
    private cart: CartService, 
    private checkout: CheckoutService
  ) {}

  ngOnInit() {
    this.paymentMethod = this.checkout.getPaymentMethod();
    
    // Si no hay método de pago definido, redirigir al formulario de envío
    if (!this.paymentMethod) {
      this.router.navigate(['/datos-envio']);
    }
  }

  get pedido() {
    return {
      numero: '#023',
      descripcion: 'La Mejor Comida Hecha en Casa',
      restaurante: 'K\'jaras Lucerito',
      items: this.cart.items,
      envio: 10,
    };
  }

  get pago() {
    const card = this.checkout.payment || {};
    
    // Determinar el texto del método de pago según el tipo
    let metodoTexto = '';
    if (this.paymentMethod === 'qr') {
      metodoTexto = 'Pago con QR';
    } else if (this.paymentMethod === 'tarjeta' && card.numeroTarjeta) {
      metodoTexto = `Tarjeta •••• ${String(card.numeroTarjeta).slice(-4)}`;
    } else {
      metodoTexto = 'Método no especificado';
    }

    return {
      metodo: metodoTexto,
      proveedor: this.paymentMethod === 'tarjeta' ? (card.nombreTarjeta || 'Proveedor') : 'QR Payment',
      direccion: this.checkout.shipping?.direccion1 || '',
      nombre: this.checkout.shipping?.nombreCompleto || '',
      telefono: this.checkout.shipping?.telefono || '',
      total: this.total,
    };
  }

  get subtotal() {
    return this.cart.getSubtotal();
  }

  get total() {
    return this.subtotal + this.pedido.envio;
  }

  getBotonTexto(): string {
    if (this.paymentMethod === 'qr') {
      return `Ir a Pago QR - ${this.total} Bs`;
    } else {
      return `Pagar con Tarjeta - ${this.total} Bs`;
    }
  }

  confirmarPago() {
    if (this.paymentMethod === 'qr') {
      // Redirigir al componente de pago QR
      this.router.navigate(['/pago-qr']);
    } else if (this.paymentMethod === 'tarjeta') {
      // Mostrar popup de confirmación para pago con tarjeta
      this.showPopup = true;
    }
  }

  finalizarPago() {
    // Limpia los datos y redirige al dashboard
    this.cart.clear();
    this.checkout.clear();
    this.showPopup = false;
    this.router.navigate(['/dashboard']);
  }

  // Go back: intentar history.back(), fallback según el método de pago
  goBack() {
    try {
      if (history.length > 1) {
        history.back();
      } else {
        // Redirigir según el método de pago actual
        if (this.paymentMethod === 'tarjeta') {
          this.router.navigate(['/datos-tarjeta']);
        } else {
          this.router.navigate(['/datos-envio']);
        }
      }
    } catch (e) {
      // Redirigir según el método de pago actual
      if (this.paymentMethod === 'tarjeta') {
        this.router.navigate(['/datos-tarjeta']);
      } else {
        this.router.navigate(['/datos-envio']);
      }
    }
  }
}