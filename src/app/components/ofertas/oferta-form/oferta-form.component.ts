import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OfertaService, Oferta } from '../oferta.service';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './oferta-form.component.html',
  styleUrls: ['./oferta-form.component.css']
})
export class OfertaFormComponent {
  private servicio = inject(OfertaService);

  oferta: Oferta = {
    descripcion: '',
    lugar: '',
    fecha_realizacion: '',
    cupos: 0,
    requisitos_especificos: '',
    fecha_limite: ''
  };

  publicarOferta() {
    this.servicio.publicarOferta(this.oferta).subscribe({
      next: () => {
        alert('Oferta publicada con éxito');
        this.oferta = {
          descripcion: '',
          lugar: '',
          fecha_realizacion: '',
          cupos: 0,
          requisitos_especificos: '',
          fecha_limite: ''
        };
      },
      error: (err) => {
        console.error(err);
        alert('Error al publicar la oferta');
      }
    });
  }
}