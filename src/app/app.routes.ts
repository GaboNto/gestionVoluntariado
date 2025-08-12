import { Routes } from '@angular/router';
import { OfertaFormComponent } from './components/ofertas/oferta-form/oferta-form.component';
import { OfertaListComponent } from './components/ofertas/oferta-list/oferta-list.component';

export const routes: Routes = [
  // Listado principal (por defecto)
  { path: 'ofertas', component: OfertaListComponent },

  // Registrar/publicar oferta (flujo coordinador)
  { path: 'ofertas/nueva', component: OfertaFormComponent },

  // Alias para compatibilidad con tu ruta anterior
  { path: 'publicar', redirectTo: 'ofertas/nueva', pathMatch: 'full' },

  // Ruta por defecto → listado
  { path: '', redirectTo: 'ofertas', pathMatch: 'full' },

  // Wildcard para rutas inexistentes
  { path: '**', redirectTo: 'ofertas' }
];
