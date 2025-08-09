import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Oferta {
  descripcion: string;
  lugar: string;
  fecha_realizacion: string;
  cupos: number;
  requisitos_especificos?: string;
  fecha_limite: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private apiUrl = 'http://localhost:3000/api/ofertas';

  constructor(private http: HttpClient) {}

  // POST: Publicar oferta
  publicarOferta(oferta: Oferta): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(this.apiUrl, {
      descripcion: oferta.descripcion,
      lugar: oferta.lugar,
      fecha_realizacion: oferta.fecha_realizacion,
      cupos: oferta.cupos,
      requisitos_especificos: oferta.requisitos_especificos,
      fecha_limite: oferta.fecha_limite
    });
  }

  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(this.apiUrl);
  }
}