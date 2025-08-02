import { Routes } from '@angular/router';
import { OfertaFormComponent } from './components/ofertas/oferta-form/oferta-form.component';
import { OfertaListComponent } from './components/ofertas/oferta-list/oferta-list.component';

export const routes: Routes = [
  { path: 'publicar', component: OfertaFormComponent },
  { path: 'ofertas', component: OfertaListComponent },
  { path: '', redirectTo: '/ofertas', pathMatch: 'full' }, // ruta por defecto
];
