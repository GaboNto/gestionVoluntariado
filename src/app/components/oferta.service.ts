import { Injectable } from '@angular/core';

export interface Oferta {
  descripcion: string;
  lugar: string;
  fecha: string;
  cupos: number;
  requisitos: string;
  fechaLimite: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private ofertas: Oferta[] = [];

  agregarOferta(oferta: Oferta) {
    this.ofertas.push(oferta);
  }

  obtenerOfertas() {
    return this.ofertas;
  }
}