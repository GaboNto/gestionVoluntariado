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
        this.ofertas = res;
      },
      error: (err) => {
        console.error('Error al obtener ofertas', err);
      }
    });
  }
}
