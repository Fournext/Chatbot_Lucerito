import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-datos-tarjeta',
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-tarjeta.html',
  styleUrl: './datos-tarjeta.css',
})
export class DatosTarjeta {
  formData = {
    numeroTarjeta: '',
    fechaExp: '',
    nombreTarjeta: '',
    cvv: '',
    pais: '',
    codigoPostal: '',
    guardar: false
  };

  handleSubmit() {
    console.log('Formulario enviado:', this.formData);
    // Aquí iría la lógica para procesar el pago
  }

  toggleGuardar() {
    this.formData.guardar = !this.formData.guardar;
  }
}
