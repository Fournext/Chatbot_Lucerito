import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-datos-envio',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-datos-envio.html',
  styleUrl: './form-datos-envio.css',
})
export class FormDatosEnvio {
  formData = {
    direccion1: '',
    direccion2: '',
    ciudad: '',
    region: '',
    pais: '',
    codigoPostal: '',
    nombreCompleto: '',
    telefono: '591',
    guardarDatos: true,
    comentario: ''
  };

  // Campo auxiliar para solo el número sin 591
  telefonoInput: string = '';

  onTelefonoChange(value: string) {
    this.telefonoInput = value;
    this.formData.telefono = '591' + value;
  }

  toggleGuardar() {
    this.formData.guardarDatos = !this.formData.guardarDatos;
  }

  handleSubmit() {
    console.log('Datos de envío:', this.formData);
    alert('Datos guardados correctamente');
  }

  guardar(){

    
  }
}
