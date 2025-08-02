import { Component } from '@angular/core';
import { OfertaFormComponent } from './components/ofertas/oferta-form/oferta-form.component';
import { OfertaListComponent } from './components/ofertas/oferta-list/oferta-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OfertaFormComponent, OfertaListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'gestionVoluntariado';
}