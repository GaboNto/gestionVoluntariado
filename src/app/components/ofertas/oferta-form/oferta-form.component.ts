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
    fecha_realizacion: '',   // <input type="date"> suele dar 'YYYY-MM-DD'
    cupos: 0,
    requisitos_especificos: '',
    fecha_limite: ''
  };

  // Normaliza a 'YYYY-MM-DD' (en UTC) por si el control entrega Date u otro formato
  private toYMD(value: any): string {
    if (!value) return '';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const d = new Date(value);
    if (isNaN(d.getTime())) return '';

    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  publicarOferta() {
    // Construimos el payload limpiando strings y normalizando fechas/números
    const payload: Oferta = {
      descripcion: this.oferta.descripcion?.trim() || '',
      lugar: this.oferta.lugar?.trim() || '',
      fecha_realizacion: this.toYMD(this.oferta.fecha_realizacion),
      cupos: Number(this.oferta.cupos) || 0,
      requisitos_especificos: this.oferta.requisitos_especificos?.trim() || '',
      fecha_limite: this.toYMD(this.oferta.fecha_limite)
    };

    this.servicio.publicarOferta(payload).subscribe({
      next: () => {
        alert('Oferta publicada con éxito');
        // reset
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
