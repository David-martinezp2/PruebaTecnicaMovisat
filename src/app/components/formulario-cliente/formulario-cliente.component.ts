import { Component } from '@angular/core'
import { ClienteService, Cliente } from '../../services/cliente.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent {

  public newClient: Cliente = { id: 0, nombre: '', email: '', coordenadas: [0, 0] }

  constructor(private clienteService: ClienteService) { }

  addClient(): void {
    this.newClient.id = Date.now() // Generar un ID único basado en la marca de tiempo
    this.clienteService.addCliente(this.newClient) // Añadir cliente a través del servicio
    this.newClient = { id: 0, nombre: '', email: '', coordenadas: [0, 0] } // Reiniciar el formulario
  }
}
