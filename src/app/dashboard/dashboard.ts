import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  selectedCategory: string = 'comida';
  
  categories = [
    { id: 'comida', label: 'Comida' },
    { id: 'bebida', label: 'Bebida' },
    { id: 'extras', label: 'Extras' }
  ];

  menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Kjara Personal',
      price: 35,
      image: 'assets/kjara-personal.jpg',
      category: 'comida'
    },
    {
      id: 2,
      name: 'Kjara Doble Mixta',
      price: 70,
      image: 'assets/kjara-doble.jpg',
      category: 'comida'
    },
    {
      id: 3,
      name: 'Kjara con Morzilla',
      price: 40,
      image: 'assets/kjara-morzilla.jpg',
      category: 'comida'
    },
    {
      id: 4,
      name: 'Piquemacho',
      price: 35,
      image: 'assets/piquemacho.jpg',
      category: 'comida'
    },
    {
      id: 5,
      name: 'Chicharon',
      price: 35,
      image: 'assets/chicharon.jpg',
      category: 'comida'
    },
    {
      id: 6,
      name: 'Fricase Personal',
      price: 20,
      image: 'assets/fricase.jpg',
      category: 'comida'
    }
  ];

  get filteredItems(): MenuItem[] {
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  addToOrder(item: MenuItem): void {
    console.log('Agregado al pedido:', item);
    // Implementar lógica para agregar al carrito
  }

  verOrden(): void {
    console.log('Ver orden completa');
    // Implementar navegación o modal de orden
  }
}
