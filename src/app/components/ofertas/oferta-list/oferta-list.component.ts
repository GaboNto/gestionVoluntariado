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

  ngOnInit() {
    this.servicio.getOfertas().subscribe({
      next: (res) => {
        this.ofertas = Array.isArray(res) ? res : [];
        if (this.ofertas.length === 0) this.cargarEjemplo();
      },
      error: (err) => {
        console.error('Error al obtener ofertas', err);
        this.cargarEjemplo();
      }
    });
  }
  private cargarEjemplo() {
    this.ofertas = [
      {
        descripcion: 'Programa de Tutorías',
        lugar: 'Campus Saucache',
        fecha_realizacion: '2025-08-20',
        cupos: 10,
        requisitos_especificos: 'Alumno regular desde 2º año',
        fecha_limite: '2025-08-18'
      },
      {
        descripcion: 'Biblioteca Digital',
        lugar: 'Biblioteca Central',
        fecha_realizacion: '2025-08-27',
        cupos: 6,
        requisitos_especificos: 'Manejo básico de Excel',
        fecha_limite: '2025-08-22'
      },
      {
        descripcion: 'Feria Vocacional',
        lugar: 'Gimnasio UTA',
        fecha_realizacion: '2025-09-05',
        cupos: 12,
        requisitos_especificos: 'Disponibilidad fin de semana',
        fecha_limite: '2025-08-30'
      },
      {
        descripcion: 'Mentorías TIC',
        lugar: 'Sala de Informática',
        fecha_realizacion: '2025-09-10',
        cupos: 8,
        requisitos_especificos: 'Conocimientos básicos de plataformas',
        fecha_limite: '2025-09-03'
      },
      {
        descripcion: 'Apoyo Deportes',
        lugar: 'Estadio Univ.',
        fecha_realizacion: '2025-09-15',
        cupos: 5,
        requisitos_especificos: 'Ganas de ayudar y puntualidad',
        fecha_limite: '2025-09-08'
      }
    ];
  }

  verOferta(o: Oferta) {
    alert(
`Descripción: ${o.descripcion}
Lugar: ${o.lugar}
Fecha realización: ${o.fecha_realizacion}
Cupos: ${o.cupos}
Requisitos: ${o.requisitos_especificos ?? '—'}
Fecha límite: ${o.fecha_limite}`
    );
  }
}
