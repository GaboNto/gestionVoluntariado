import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Estado = 'Registrada' | 'Publicada' | 'Cerrada';

export interface Oferta {
  idOferta: number;
  descripcion: string;
  lugar: string;
  fechaRealizacion?: string;     // la define el backend al publicar
  fechaTerminoOferta: string;    // formato YYYY-MM-DD
  requisitos?: string;
  estado: Estado;
  cupos: number;
}

// Para registrar no se envían: idOferta, estado ni fechaRealizacion
export type NuevaOferta = Omit<Oferta, 'idOferta' | 'estado' | 'fechaRealizacion'>;

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private apiUrl = 'http://localhost:3000/api/ofertas';

  constructor(private http: HttpClient) {}

  /** Registrar oferta (estado = 'Registrada', sin fechaRealizacion) */
  registrarOferta(oferta: NuevaOferta): Observable<{
    ok: boolean;
    message: string;
    idOferta: number;
    oferta: Oferta;
  }> {
    return this.http.post<{
      ok: boolean;
      message: string;
      idOferta: number;
      oferta: Oferta;
    }>(`${this.apiUrl}/registrar`, oferta);
  }

  /** Publicar oferta (setea fechaRealizacion y estado = 'Publicada') */
  publicarOferta(idOferta: number): Observable<{
    ok: boolean;
    message: string;
    oferta: Oferta;
  }> {
    return this.http.post<{
      ok: boolean;
      message: string;
      oferta: Oferta;
    }>(`${this.apiUrl}/${idOferta}/publicar`, {});
  }

  /** Listar ofertas publicadas */
  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(this.apiUrl);
  }

  /** Listar todas para panel interno del coordinador */
  getTodas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.apiUrl}/todas`);
  }
}
