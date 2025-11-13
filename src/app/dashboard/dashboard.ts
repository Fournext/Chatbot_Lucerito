import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private router: Router, private cart: CartService) {}

  selectedCategory: string = 'comida';

  categories = [
    { id: 'comida', label: 'Comida' },
    { id: 'bebida', label: 'Bebida' },
    { id: 'extras', label: 'Extras' }
  ];

  menuItems: MenuItem[] = [
    { id: 1, name: 'Kjara Personal', price: 35, image: 'assets/kjara-personal.png', category: 'comida' },
    { id: 2, name: 'Kjara Doble Mixta', price: 70, image: 'assets/kjara-doble.png', category: 'comida' },
    { id: 3, name: 'Kjara con Morzilla', price: 40, image: 'assets/kjara-morzilla.png', category: 'comida' },
    { id: 4, name: 'Piquemacho', price: 35, image: 'assets/piquemacho.png', category: 'comida' },
    { id: 5, name: 'Chicharon', price: 35, image: 'assets/chicharon.png', category: 'comida' },
    { id: 6, name: 'Fricase Personal', price: 20, image: 'assets/fricase.png', category: 'comida' },

    { id: 7, name: 'Coca Cola 2LT', price: 18, image: 'assets/CocaCola2LT.png', category: 'bebida' },
    { id: 8, name: 'Simba Manzana 2Lt', price: 15, image: 'assets/SimbaManzana2Lt.png', category: 'bebida' },
    { id: 9, name: 'Fanta Mandarina 2Lt', price: 18, image: 'assets/FantaMandarina2Lt.png', category: 'bebida' },
    { id: 10, name: 'Sprite 2Lt', price: 18, image: 'assets/Sprite2Lt.png', category: 'bebida' },

  ];

  get filteredItems(): MenuItem[] {
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  getQuantity(item: MenuItem): number {
    return this.cart.getQuantity(item.id);
  }

  increase(item: MenuItem): void {
    this.cart.increase(item.id);
  }

  decrease(item: MenuItem): void {
    this.cart.decrease(item.id);
  }

  addToOrder(item: MenuItem): void {
    this.cart.addFromMenu(item, 1);
  }

  goBack(): void {
    try {
      if (history.length > 1) {
        history.back();
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (e) {
      this.router.navigate(['/dashboard']);
    }
  }

  verOrden(): void {
    this.router.navigate(['/order']);
  }
}
