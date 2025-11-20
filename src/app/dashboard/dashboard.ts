import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private productService = inject(ProductService);
  constructor(
    private router: Router, 
    private cart: CartService
  ) {}

  selectedCategory: string = 'comida';

  categories = [
    { id: 'comida', label: 'Comida' },
    { id: 'bebida', label: 'Bebida' },
    { id: 'extras', label: 'Extras' }
  ];

  menuItems = computed(() => this.productService.listarProductos());

  ngOnInit(): void {
     this.productService.getProducts().subscribe({
      next: () => console.log('✅ Productos cargados'),
      error: err => console.error('❌ Error al obtener productos:', err)
    });
  }
  
  get filteredItems(): productos[] {
    return this.menuItems().filter(item => item.category === this.selectedCategory);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  getQuantity(item: productos): number {
    return this.cart.getQuantity(item.id);
  }

  increase(item: productos): void {
    this.cart.increase(item.id);
  }

  decrease(item: productos): void {
    this.cart.decrease(item.id);
  }

  addToOrder(item: productos): void {
    this.cart.addFromMenu(item, 1);
  }

  get hasItems(): boolean {
    return this.cart.items.length > 0;
  }

  verOrden(): void {
    if (this.hasItems) {
      this.router.navigate(['/order']);
    }
  }
}
