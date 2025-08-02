import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfertaService } from '../../oferta.service';

@Component({
  selector: 'app-oferta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oferta-list.component.html'
})
export class OfertaListComponent {
  constructor(public servicio: OfertaService) {}
}