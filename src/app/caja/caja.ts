import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CheckoutService, PaymentMethod } from '../services/checkout.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-caja',
  imports: [CommonModule],
  templateUrl: './caja.html',
  styleUrl: './caja.css',
})
export class Caja implements OnInit {
  showPopup = false;
  showLocationModal = false;
  paymentMethod: PaymentMethod = '';
  
  // Variables para el mapa del modal
  private modalMap?: L.Map;
  private modalMarker?: L.Marker;
  tempLat?: number;
  tempLng?: number;

  constructor(
    private router: Router, 
    private cart: CartService, 
    private checkout: CheckoutService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
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
      nombre: this.checkout.shipping?.nombre_completo || '',
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

  // Métodos para el modal de ubicación
  openLocationModal() {
    this.showLocationModal = true;
    
    // Obtener coordenadas actuales del checkout
    const shipping = this.checkout.shipping;
    this.tempLat = shipping?.latitud || -16.5;
    this.tempLng = shipping?.longitud || -68.15;
    
    // Esperar a que el DOM se actualice antes de inicializar el mapa
    setTimeout(() => {
      this.initModalMap();
    }, 100);
  }

  closeLocationModal() {
    if (this.modalMap) {
      this.modalMap.remove();
      this.modalMap = undefined;
      this.modalMarker = undefined;
    }
    this.showLocationModal = false;
  }

  updateLocation() {
    // Actualizar las coordenadas en el checkout
    if (this.checkout.shipping && this.tempLat && this.tempLng) {
      this.checkout.shipping.latitud = this.tempLat;
      this.checkout.shipping.longitud = this.tempLng;
    }
    this.closeLocationModal();
  }

  private initModalMap() {
    if (!this.tempLat || !this.tempLng) return;

    // Crear mapa centrado en la ubicación actual
    this.modalMap = L.map('modalMap').setView([this.tempLat, this.tempLng], 16);

    // Añadir capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.modalMap);

    // Crear marcador draggable
    this.modalMarker = L.marker([this.tempLat, this.tempLng], {
      draggable: true
    }).addTo(this.modalMap);

    // Evento cuando se arrastra el marcador
    this.modalMarker.on('dragend', () => {
      if (this.modalMarker) {
        const position = this.modalMarker.getLatLng();
        this.ngZone.run(() => {
          this.tempLat = position.lat;
          this.tempLng = position.lng;
          this.cdr.detectChanges();
        });
      }
    });

    // Evento click en el mapa
    this.modalMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (this.modalMarker) {
        this.modalMarker.setLatLng([lat, lng]);
        this.ngZone.run(() => {
          this.tempLat = lat;
          this.tempLng = lng;
          this.cdr.detectChanges();
        });
      }
    });
  }
}