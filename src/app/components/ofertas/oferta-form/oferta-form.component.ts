import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OfertaService, NuevaOferta } from '../oferta.service';

type EstadoUI = 'form' | 'registrada' | 'publicada';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './oferta-form.component.html',
  styleUrls: ['./oferta-form.component.css']
})
export class OfertaFormComponent implements OnInit {
  private servicio = inject(OfertaService);

  estado: EstadoUI = 'form';

  // datos de confirmación
  ultimaDescripcion = '';
  ultimaId?: number;
  fechaRealizacionAsignada?: string; // viene del backend al publicar

  // Para validación del date mínimo (hoy)
  fechaActual = '';

  // Modelo para REGISTRAR (sin fechaRealizacion, sin estado, sin idOferta)
  oferta: NuevaOferta = {
    descripcion: '',
    lugar: '',
    fechaTerminoOferta: '',
    requisitos: '',
    cupos: 0
  };

  ngOnInit() {
    this.fechaActual = this.formatearFecha(new Date());
  }

  // Formatea fecha a YYYY-MM-DD
  private formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Validación mínima para registrar
  private validarRegistro(): boolean {
    return !!(
      this.oferta.descripcion?.trim() &&
      this.oferta.lugar?.trim() &&
      this.oferta.cupos > 0 &&
      this.oferta.fechaTerminoOferta &&
      this.oferta.fechaTerminoOferta >= this.fechaActual
    );
  }

  // 👉 Método público para el template
  validarDatos(): boolean {
    return this.validarRegistro();
  }

  /** Paso 1: Registrar (estado='Registrada', sin fechaRealizacion) */
  registrarOferta() {
    if (!this.validarRegistro()) {
      alert('Completa los campos obligatorios y verifica las fechas.');
      return;
    }

    // normaliza strings
    const payload: NuevaOferta = {
      descripcion: this.oferta.descripcion.trim(),
      lugar: this.oferta.lugar.trim(),
      fechaTerminoOferta: this.oferta.fechaTerminoOferta,
      requisitos: this.oferta.requisitos?.trim() || '',
      cupos: Number(this.oferta.cupos)
    };

    this.servicio.registrarOferta(payload).subscribe({
      next: (res) => {
        this.ultimaDescripcion = res.oferta.descripcion;
        this.ultimaId = res.idOferta;
        this.estado = 'registrada';
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar la oferta');
      }
    });
  }

  /** Paso 2: Publicar (setea fechaRealizacion y estado='Publicada') */
  publicarOferta() {
    if (!this.ultimaId) return;

    this.servicio.publicarOferta(this.ultimaId).subscribe({
      next: (res) => {
        this.estado = 'publicada';
        this.fechaRealizacionAsignada = res.oferta.fechaRealizacion; // mostrará la fecha asignada por el backend
      },
      error: (err) => {
        console.error(err);
        alert('Error al publicar la oferta');
      }
    });
  }

  nuevaOferta() {
    this.estado = 'form';
    this.oferta = {
      descripcion: '',
      lugar: '',
      fechaTerminoOferta: '',
      requisitos: '',
      cupos: 0
    };
    this.ultimaDescripcion = '';
    this.ultimaId = undefined;
    this.fechaRealizacionAsignada = undefined;
  }
}
