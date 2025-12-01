import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../services/checkout.service';
import { ShippingData } from '../../interface/envio';
import * as L from 'leaflet';

@Component({
  selector: 'app-form-datos-envio',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-datos-envio.html',
  styleUrl: './form-datos-envio.css',
})
export class FormDatosEnvio implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private router: Router, 
    private checkout: CheckoutService, 
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // preload form with any saved shipping data
    if (this.checkout.shipping) {
      this.formData = { ...this.formData, ...this.checkout.shipping };
      // set telefonoInput if exists without the +591 prefix
      if (this.formData.telefono && this.formData.telefono.startsWith('591')) {
        this.telefonoInput = this.formData.telefono.replace(/^591/, '');
      }
    }
  }
  ngOnInit(): void {
    this.getUserLocation();
  }


  // Mapa de Leaflet
  lat = -16.5;  // posición por defecto (La Paz, Bolivia)
  lng = -68.15;
  zoom = 16;
  
  private map!: L.Map;
  private marker!: L.Marker; 

  // Control del modal
  showPaymentModal: boolean = false;

  formData: ShippingData = {};

  // Campo auxiliar para solo el número sin 591
  telefonoInput: string = '';
  telefonoError: string | null = null;

  // Control de notificación de error
  showErrorNotification: boolean = false;
  errorNotificationMessage: string = '';

  // Métodos para el modal
  openPaymentModal(): void {
    // Validar que todos los campos requeridos estén llenos
    if (!this.validateForm()) {
      return;
    }
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  validateForm(): boolean {
    let isValid = true;
    let errorMessage = '';

    // Validar nombre completo
    if (!this.formData.nombre_completo || this.formData.nombre_completo.trim() === '') {
      errorMessage = 'Por favor, ingresa tu nombre completo';
      isValid = false;
    }
    // Validar teléfono
    else if (!this.isTelefonoValid()) {
      errorMessage = this.telefonoError || 'Por favor, ingresa un número de teléfono válido';
      isValid = false;
    }
    // Validar ubicación
    else if (!this.formData.latitud || !this.formData.longitud) {
      errorMessage = 'Por favor, selecciona una ubicación en el mapa';
      isValid = false;
    }

    if (!isValid) {
      this.showError(errorMessage);
    }

    return isValid;
  }

  showError(message: string) {
    this.errorNotificationMessage = message;
    this.showErrorNotification = true;
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      this.showErrorNotification = false;
    }, 4000);
  }

  selectQRPayment(): void {
    // Guarda los datos de envío y redirige a pago-qr
    this.checkout.setPaymentMethod('qr');
    this.checkout.setShipping(this.formData);
    this.closePaymentModal();
    this.router.navigate(['/caja']);
  }

  selectCardPayment(): void {
    // Guarda los datos de envío y redirige a datos-tarjeta
    this.checkout.setPaymentMethod('tarjeta');
    this.checkout.setShipping(this.formData);
    this.closePaymentModal();
    this.router.navigate(['/datos-tarjeta']);
  }

  onTelefonoChange(value: string) {
    this.telefonoInput = value.replace(/\s+/g, '');
    this.validateTelefonoInput();
  }

  validateTelefonoInput(): boolean {
    const v = (this.telefonoInput || '').replace(/\D/g, '');
    // aceptar solamente números y longitud 7 u 8 (números válidos en Bolivia)
    if (!v) {
      this.telefonoError = 'El teléfono es requerido';
      this.formData.telefono = '';
      return false;
    }
    if (!/^\d+$/.test(v)) {
      this.telefonoError = 'Solo se permiten dígitos';
      this.formData.telefono = '';
      return false;
    }
    if (v.length < 7 || v.length > 8) {
      this.telefonoError = 'El número debe tener 7 u 8 dígitos';
      this.formData.telefono = '';
      return false;
    }
    // Si pasa validación, actualizar formData con el código de país
    this.telefonoError = null;
    this.formData.telefono = '591' + v;
    return true;
  }

  isTelefonoValid(): boolean {
    return this.telefonoError === null && !!this.formData.telefono;
  }

  toggleGuardar() {
    this.formData.guardarDatos = !this.formData.guardarDatos;
  }

  // Este método ya no se usa desde el template, pero lo mantengo por si acaso
  handleSubmit() {
    // Ahora este método abre el modal en lugar de navegar directamente
    this.openPaymentModal();
  }

  guardar() {
    // Método existente - mantener por compatibilidad
  }

  goBack() {
    try {
      if (history.length > 1) {
        history.back();
      } else {
        this.router.navigate(['/order']);
      }
    } catch (e) {
      this.router.navigate(['/order']);
    }
  }
  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    // Crear mapa centrado en posición inicial
    this.map = L.map('map').setView([this.lat, this.lng], this.zoom);

    // Añadir capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Crear marcador draggable
    this.marker = L.marker([this.lat, this.lng], {
      draggable: true
    }).addTo(this.map);

    // Evento cuando se arrastra el marcador
    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      console.log('Dragend event:', position.lat, position.lng);
      this.ngZone.run(() => {
        this.updatePosition(position.lat, position.lng);
        this.cdr.detectChanges();
      });
    });

    // Evento click en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      //console.log('Click event:', lat, lng);
      this.marker.setLatLng([lat, lng]);
      this.ngZone.run(() => {
        this.updatePosition(lat, lng);
        this.cdr.detectChanges();
      });
    });
  }

  updatePosition(lat: number, lng: number) {
    //console.log('updatePosition called:', lat, lng);
    this.lat = lat;
    this.lng = lng;
    this.formData.latitud = lat;
    this.formData.longitud = lng;
    //console.log('formData updated:', this.formData.latitud, this.formData.longitud);
  }

  getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;

          // Actualizar mapa y marcador si ya están inicializados
          if (this.map && this.marker) {
            this.map.setView([this.lat, this.lng], this.zoom);
            this.marker.setLatLng([this.lat, this.lng]);
          }

          // Guardar en formData
          this.formData.latitud = this.lat;
          this.formData.longitud = this.lng;
        },
        err => console.error("Error ubicacion:", err)
      );
    }
  }
}