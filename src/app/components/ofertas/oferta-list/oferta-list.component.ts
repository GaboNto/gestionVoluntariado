import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OfertaService, Oferta } from '../oferta.service';

@Component({
  selector: 'app-oferta-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './oferta-list.component.html',
  styleUrls: ['./oferta-list.component.css']
})
export class OfertaListComponent implements OnInit {
  servicio = inject(OfertaService);
  ofertas: Oferta[] = [];
  ofertaSeleccionada: Oferta | null = null; // ← para el modal

  ngOnInit() {
    this.servicio.getOfertas().subscribe({
      next: (res) => {
        this.ofertas = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Error al obtener ofertas', err);
      }
    });
  }
  verOferta(o: Oferta) {
    this.ofertaSeleccionada = o; // ← abre modal
  }

  cerrarDetalle() {
    this.ofertaSeleccionada = null; // ← cierra modal
  }

  // Formatea YYYY-MM-DD -> DD/MM/YYYY
  formatFecha(f?: string) {
    if (!f) return '—';

    // Caso típico MySQL DATE: 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) {
      const [y, m, d] = f.split('-');
      return `${d}/${m}/${y}`;
    }

    // ISO u otros: 'YYYY-MM-DDTHH:mm:ss.sssZ'
    const d = new Date(f);
    if (!isNaN(d.getTime())) {
      // Mostrar siempre DD/MM/YYYY, sin desfases
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const yy = d.getUTCFullYear();
      return `${dd}/${mm}/${yy}`;
    }

    // Fallback (por si llegara algo raro)
    const parts = f.split(/[T\s/:.-]/).filter(Boolean);
    if (parts.length >= 3) {
      const [y, m, d2] = parts;
      if (y.length === 4) return `${d2.padStart(2,'0')}/${m.padStart(2,'0')}/${y}`;
    }
    return f;
  }

}
