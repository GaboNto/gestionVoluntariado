import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfertaService, Oferta } from '../../oferta.service';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './oferta-form.component.html'
})
export class OfertaFormComponent {
  oferta: Oferta = {
    descripcion: '',
    lugar: '',
    fecha: '',
    cupos: 0,
    requisitos: '',
    fechaLimite: ''
  };

  constructor(private servicio: OfertaService) {}

  publicarOferta() {
    this.servicio.agregarOferta({ ...this.oferta });
    this.oferta = {
      descripcion: '',
      lugar: '',
      fecha: '',
      cupos: 0,
      requisitos: '',
      fechaLimite: ''
    };
  }
}