import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-caja',
  imports: [],
  templateUrl: './caja.html',
  styleUrl: './caja.css',
})
export class Caja {
  showPopup = false;
  constructor(
    private router: Router, 
    private cart: CartService, 
    private checkout: CheckoutService
  ) {}

  get pedido() {
    return {
      numero: '#023',
      descripcion: 'La Mejor Comida Hecha en Casa',
      restaurante: 'K’jaras Lucerito',
      items: this.cart.items,
      envio: 10,
    };
  }

  get pago() {
    // construir información de pago a mostrar desde checkout.service
    const card = this.checkout.payment || {};
    return {
      metodo: card.numeroTarjeta ? `Tarjeta •••• ${String(card.numeroTarjeta).slice(-4)}` : 'Método no especificado',
      proveedor: card.nombreTarjeta || 'Proveedor',
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

  confirmarPago() {
    // Mostrar popup animado
    this.showPopup = true;

    // Limpia los datos
    this.cart.clear();
    this.checkout.clear();

    // Oculta popup y redirige al dashboard después de unos segundos
    setTimeout(() => {
      this.showPopup = false;
      this.router.navigate(['/dashboard']);
    }, 2500);
  }

  // Go back: intentar history.back(), fallback a datos-tarjeta
  goBack() {
    try {
      if (history.length > 1) {
        history.back();
      } else {
        this.router.navigate(['/datos-tarjeta']);
      }
    } catch (e) {
      this.router.navigate(['/datos-tarjeta']);
    }
  }
}
