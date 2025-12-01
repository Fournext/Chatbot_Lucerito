import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { User } from '../../interface/user';
import { UserService } from '../services/user.service';
import { SendPaymentService } from '../services/send-payment.service';
import { SendMessageService } from '../services/send-message.service';
import { ShippingData } from '../../interface/envio';

@Component({
  selector: 'app-pago-qr',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './pago-qr.html',
  styleUrl: './pago-qr.css',
})
export class PagoQR implements OnInit {
  private userService = inject(UserService);
  private sendPaymentService = inject(SendPaymentService);
  private sendMessageService = inject(SendMessageService);
  constructor(
    private router: Router,
    private cart: CartService,
    private checkout: CheckoutService
  ) {}

  // Datos para el QR
  qrData: string = '';
  formData: ShippingData = {};
  
  // Información del pedido
  pedidoNumero: string = '#QR-' + Math.floor(1000 + Math.random() * 9000);
  subtotal: number = 0;
  envio: number = 10;
  total: number = 0;

  // Control del popup
  showPopup: boolean = false;
  usuario: User = {};
  chatId: string = '';

  idUser = computed(() => this.userService.userid);
  ordercod = computed(() => this.sendPaymentService.ordercod);
  
  ngOnInit() {
    this.calcularTotales();
    this.generarQRData();
    
    // Verificar si Telegram WebApp está disponible
    const Telegram = (window as any).Telegram;
    if (!Telegram || !Telegram.WebApp) {
      console.warn('⚠️ Telegram WebApp no está disponible. Usando datos de prueba.');
      // Datos de prueba para desarrollo local
      this.chatId = 'test_user';
      this.usuario = {
        chat_id: 'test_user',
      };
      this.userService.createUser(this.usuario).subscribe({
        next: () => console.log('✅ Id obtenido (modo prueba)'),
        error: err => console.error('❌ Error al obtener productos:', err)
      });
      return;
    }

    const tg = Telegram.WebApp;
    tg.ready();
    const userData = tg.initDataUnsafe?.user;
    //console.log('Datos del usuario:', userData);

    // ID del chat (equivale al chat_id)
    const chatId = userData?.id;
    //console.log('Chat ID:', chatId);
    
    if (!chatId) {
      console.error('❌ No se pudo obtener el ID del usuario de Telegram');
      return;
    }
    
    this.chatId = chatId.toString();
    this.usuario = {
      chat_id: chatId.toString(),
    };
    
    this.userService.createUser(this.usuario).subscribe({
      next: () => console.log('✅ Id obtenido'),
      error: err => console.error('❌ Error al obtener usuario:', err)
    });
  }

  enviarDetallesOrden() {
    const ordenCod = this.sendPaymentService.ordercod();
    if (!ordenCod) {
      console.error('❌ No se pudo obtener el código de orden');
      return;
    }

    // Enviar cada item del carrito como detalle de orden
    this.cart.items.forEach((item, index) => {
      const detalle = {
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      };

      this.sendPaymentService.createDetailOrder(detalle, ordenCod).subscribe({
        next: () => console.log(`✅ Detalle ${index + 1}/${this.cart.items.length} enviado:`, item.name),
        error: err => console.error(`❌ Error enviando detalle para ${item.name}:`, err)
      });
    });
  }

  enviarDatosEnvio() {
    this.formData = this.checkout.shipping;  
    this.formData.user_telegram_id = this.userService.userid()?.toString() || '';
    this.formData.ciudad = 'Sanata Cruz';
    this.formData.region = 'Santa Cruz';
    this.formData.pais = 'Bolivia';
    this.formData.codigo_postal = '0000';
    console.log('Datos de envío a enviar:', this.formData);
    const ordenCod = this.sendPaymentService.ordercod();
    this.formData.orden_id = ordenCod ? ordenCod : undefined;
    if (!ordenCod) {
      console.error('❌ No se pudo obtener el código de orden');
      return;
    }
    this.sendPaymentService.createShipping(this.formData, ordenCod).subscribe({
      next: () => console.log('✅ Datos de envío enviados'),
      error: err => console.error('❌ Error enviando datos de envío:', err)
    });
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
    this.showPopup = true;
  }

  finalizarPago() {
    // Crear orden y enviar detalles
    const userId = this.userService.userid();
    
    if (!userId) {
      console.error('❌ No hay ID de usuario disponible');
      alert('Error: No se pudo obtener el ID de usuario.');
      return;
    }

    this.sendPaymentService.createOrder({
      user_telegram_id: userId,
      estado: 'pendiente',
    }).subscribe({
      next: () => {
        console.log('✅ Orden creada');
        this.enviarDetallesOrden();
        this.enviarDatosEnvio();
        // Enviar mensaje a Telegram con el resumen del pedido
        if (this.chatId) {
          this.sendMessageService.sendOrderMessage(
            this.chatId,
            this.cart.items,
            this.total
          ).subscribe({
            next: () => console.log('✅ Mensaje enviado a Telegram'),
            error: err => console.error('❌ Error al enviar mensaje:', err)
          });
        }
        
        // Limpiar carrito y datos de checkout
        this.cart.clear();
        this.checkout.clear();
        
        // Cerrar popup y redirigir al dashboard
        this.showPopup = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('❌ Error al crear orden:', err);
        alert('Error al procesar el pago. Por favor intenta nuevamente.');
      }
    });
  }  cancelarPago() {
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