import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfertaService, Oferta } from '../oferta.service';

@Component({
  selector: 'app-oferta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oferta-list.component.html',
  styleUrls: ['./oferta-list.component.css']
})
export class OfertaListComponent implements OnInit {
  private servicio = inject(OfertaService);

  ofertas: Oferta[] = [];
  ofertaSeleccionada: Oferta | null = null;

  cargando = true;
  error?: string;

  ngOnInit() {
    this.servicio.getOfertas().subscribe({
      next: (rows) => {
        this.ofertas = Array.isArray(rows) ? rows : [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener ofertas', err);
        this.error = 'No se pudieron cargar las ofertas publicadas.';
        this.cargando = false;
      }
    });
  }

  verOferta(o: Oferta) {
    this.ofertaSeleccionada = o; // abre modal / panel detalle
  }

  cerrarDetalle() {
    this.ofertaSeleccionada = null; // cierra modal / panel detalle
  }

  trackById(_: number, o: Oferta) {
    return o.idOferta;
  }

  /** Formatea 'YYYY-MM-DD' o ISO a 'DD/MM/YYYY' (sin zona horaria local). */
  formatFecha(f?: string) {
    if (!f) return '—';

    // 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) {
      const [y, m, d] = f.split('-');
      return `${d}/${m}/${y}`;
    }

    // ISO 'YYYY-MM-DDTHH:mm:ss.sssZ' o sin Z
    const d = new Date(f);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const yy = d.getUTCFullYear();
      return `${dd}/${mm}/${yy}`;
    }

    // Fallback
    return f;
  }
}
