import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TablaClientesComponent} from "./components/tabla-clientes/tabla-clientes.component";
import {MapaComponent} from "./components/mapa/mapa.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TablaClientesComponent, MapaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PruebaFrontendMovisat_DavidMartinez';
}
