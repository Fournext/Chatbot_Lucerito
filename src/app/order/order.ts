import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  constructor(private router: Router, private cart: CartService) {
    // mantener referencia para plantilla
    this.pedido.items = this.cart.items as any;
  }
  pedido: any = {
    numero: '#023',
    restaurante: 'Kjaras Lucerito',
    descripcion: 'La Mejor Comida Hecha en Casa',
    items: [] as any[], 
    envio: 10,
  };

  get subtotal() {
    return this.cart.getSubtotal();
  }

  get total() {
    return this.subtotal + this.pedido.envio;
  }

  pagar() {
    this.router.navigate(['/datos-envio']);
  }

  // Aumenta la cantidad de un item en la orden
  increase(item: any) {
    this.cart.increase(item.id);
  }

  // Disminuye la cantidad; si llega a 0 la deja en 0
  decrease(item: any) {
    this.cart.decrease(item.id);
  }

  // Añadir inicial (cuando estaba 0) — establece cantidad a 1
  addToOrder(item: any) {
    this.cart.addFromMenu(item, 1);
  }

  // Go back: desde la vista de orden siempre volver al dashboard
  goBack() {
    try {
      // Intentamos history.back primero si hay historial
      if (history.length > 1) {
        history.back();
        // después de un pequeño delay, si la url sigue siendo /order, forzamos navegación
        setTimeout(() => {
          if (this.router.url && this.router.url.includes('/order')) {
            this.router.navigate(['/dashboard']);
          }
        }, 200);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (e) {
      this.router.navigate(['/dashboard']);
    }
  }
}
