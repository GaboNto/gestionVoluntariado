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
    fecha: '',
    cupos: 0,
    requisitos: '',
    fechaLimite: ''
  };

  publicarOferta() {
    this.servicio.publicarOferta(this.oferta).subscribe({
      next: () => {
        alert('Oferta publicada con éxito');
        this.oferta = {
          descripcion: '',
          lugar: '',
          fecha: '',
          cupos: 0,
          requisitos: '',
          fechaLimite: ''
        };
      },
      error: (err) => {
        console.error(err);
        alert('Error al publicar la oferta');
      }
    });
  }
}
