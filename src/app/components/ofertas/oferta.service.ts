import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Oferta {
  descripcion: string;
  lugar: string;
  fecha: string;
  cupos: number;
  requisitos?: string;
  fechaLimite: string;
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
      fecha: oferta.fecha,
      cupos: oferta.cupos,
      requisitos: oferta.requisitos,
      fecha_limite: oferta.fechaLimite
    });
  }

  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(this.apiUrl);
  }
}
