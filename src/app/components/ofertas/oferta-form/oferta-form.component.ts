import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OfertaService, Oferta } from '../oferta.service';
import { CommonModule } from '@angular/common';

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

  ultimaDescripcion = '';
  ultimaId?: number;

  // Propiedades para validaciones de fecha
  fechaActual: string = '';
  fechaMinimaRealizacion: string = '';
  fechaMinimaLimite: string = '';

  oferta: Oferta = {
    descripcion: '',
    lugar: '',
    fecha_realizacion: '',   // <input type="date"> -> 'YYYY-MM-DD'
    cupos: 0,
    requisitos_especificos: '',
    fecha_limite: ''
  };

  ngOnInit() {
    this.inicializarFechas();
  }

  // Inicializa las fechas mínimas
  private inicializarFechas() {
    const hoy = new Date();
    this.fechaActual = this.formatearFecha(hoy);
    this.fechaMinimaRealizacion = this.fechaActual;
    this.actualizarFechaMinimaLimite();
  }

  // Formatea fecha a YYYY-MM-DD
  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Actualiza la fecha mínima para la fecha límite
  private actualizarFechaMinimaLimite() {
    if (this.oferta.fecha_realizacion) {
      this.fechaMinimaLimite = this.oferta.fecha_realizacion;
      // Si la fecha límite actual es anterior a la nueva fecha mínima, la reseteamos
      if (this.oferta.fecha_limite && this.oferta.fecha_limite < this.fechaMinimaLimite) {
        this.oferta.fecha_limite = '';
      }
    } else {
      this.fechaMinimaLimite = this.fechaActual;
    }
  }

  // Valida la fecha de realización
  onFechaRealizacionChange() {
    this.actualizarFechaMinimaLimite();
  }

  // Valida la fecha límite
  onFechaLimiteChange() {
    // Solo actualizar la fecha mínima si es necesario
  }

  // Método para verificar si el formulario está completo y válido
  validarDatos(): boolean {
    return !!(
      this.oferta.descripcion?.trim() &&
      this.oferta.lugar?.trim() &&
      this.oferta.cupos && this.oferta.cupos > 0 &&
      this.oferta.requisitos_especificos?.trim() &&
      this.oferta.fecha_realizacion &&
      this.oferta.fecha_limite &&
      this.oferta.fecha_realizacion >= this.fechaActual &&
      this.oferta.fecha_limite >= this.fechaMinimaLimite
    );
  }

  // Normaliza a 'YYYY-MM-DD' (por si el value no viene en texto)
  private toYMD(value: any): string {
    if (!value) return '';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  publicarOferta() {
    // Validar formulario antes de enviar
    if (!this.validarDatos()) {
      return;
    }

    const payload: Oferta = {
      descripcion: this.oferta.descripcion?.trim() || '',
      lugar: this.oferta.lugar?.trim() || '',
      fecha_realizacion: this.toYMD(this.oferta.fecha_realizacion),
      cupos: Number(this.oferta.cupos) || 0,
      requisitos_especificos: this.oferta.requisitos_especificos?.trim() || '',
      fecha_limite: this.toYMD(this.oferta.fecha_limite)
    };

    this.servicio.publicarOferta(payload).subscribe({
      next: (res) => {
        this.ultimaDescripcion = payload.descripcion;
        this.ultimaId = (res as any)?.id; 
        this.estado = 'registrada';       
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar la oferta');
      }
    });
  }

  confirmarPublicacion() {
    this.estado = 'publicada';
  }

  nuevaOferta() {
    this.estado = 'form';
    this.oferta = {
      descripcion: '',
      lugar: '',
      fecha_realizacion: '',
      cupos: 0,
      requisitos_especificos: '',
      fecha_limite: ''
    };
    this.ultimaDescripcion = '';
    this.ultimaId = undefined;
    this.actualizarFechaMinimaLimite();
  }
}
