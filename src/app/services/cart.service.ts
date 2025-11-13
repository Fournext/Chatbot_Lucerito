import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  items: CartItem[] = [];

  // Añade un item (desde menú) o incrementa si ya existe
  addFromMenu(menuItem: any, qty: number = 1) {
    const id = menuItem.id;
    const existing = this.items.find(i => i.id === id);
    if (existing) {
      existing.cantidad += qty;
    } else {
      this.items.push({
        id: menuItem.id,
        name: menuItem.name,
        precio: menuItem.price ?? menuItem.precio ?? 0,
        image: menuItem.image,
        cantidad: qty
      });
    }
  }

  increase(id: number) {
    const it = this.items.find(i => i.id === id);
    if (it) it.cantidad += 1;
  }

  decrease(id: number) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx === -1) return;
    const it = this.items[idx];
    it.cantidad -= 1;
    if (it.cantidad <= 0) {
      this.items.splice(idx, 1);
    }
  }

  getQuantity(id: number): number {
    const it = this.items.find(i => i.id === id);
    return it ? it.cantidad : 0;
  }

  clear() {
    this.items.length = 0;
  }

  getSubtotal(): number {
    return this.items.reduce((s, i) => s + (i.precio * i.cantidad), 0);
  }
}
