import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-pago-qr',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './pago-qr.html',
  styleUrl: './pago-qr.css',
})
export class PagoQR implements OnInit {
  
  constructor(
    private router: Router,
    private cart: CartService,
    private checkout: CheckoutService
  ) {}

  // Datos para el QR
  qrData: string = '';
  
  // Información del pedido
  pedidoNumero: string = '#QR-' + Math.floor(1000 + Math.random() * 9000);
  subtotal: number = 0;
  envio: number = 10;
  total: number = 0;

  // Control del popup
  showPopup: boolean = false;

  ngOnInit() {
    this.calcularTotales();
    this.generarQRData();
  }

  calcularTotales() {
    this.subtotal = this.cart.getSubtotal();
    this.total = this.subtotal + this.envio;
  }

  generarQRData() {
    // Estructura de datos para el pago QR
    const paymentData = {
      version: '1.0',
      type: 'payment',
      merchant: {
        name: 'Kjaras Lucerito',
        id: 'KJARA-001'
      },
      transaction: {
        id: this.pedidoNumero,
        amount: this.total,
        currency: 'BOB',
        description: 'Pedido de comida',
        timestamp: new Date().toISOString()
      },
      account: {
        bank: 'QR_PAYMENT',
        accountNumber: '591234567890'
      }
    };

    // Convertir a string para el QR
    this.qrData = JSON.stringify(paymentData);
    
    console.log('QR Data generado:', paymentData);
  }

  simularPagoExitoso() {
    // En una app real, aquí verificarías el pago con el backend
    // Por ahora simulamos el pago exitoso mostrando el popup
    
    // Mostrar popup de pago exitoso (igual que en Caja)
    this.showPopup = true;
  }

  finalizarPago() {
    // Limpiar carrito y datos de checkout
    this.cart.clear();
    this.checkout.clear();
    
    // Cerrar popup y redirigir al dashboard
    this.showPopup = false;
    this.router.navigate(['/dashboard']);
  }

  cancelarPago() {
    if(confirm('¿Estás seguro de que quieres cancelar el pago?')) {
      this.router.navigate(['/datos-envio']);
    }
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
}