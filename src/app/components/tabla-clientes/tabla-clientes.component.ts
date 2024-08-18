import { Component, OnInit } from '@angular/core'
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid'
import { ClienteService, Cliente } from '../../services/cliente.service'

@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  standalone: true,
  imports: [
    jqxGridModule
  ],
  styleUrls: ['./tabla-clientes.component.css']
})
export class TablaClientesComponent implements OnInit {

  public data: Cliente[] = []
  public source: any
  public dataAdapter: any
  public columns: any[] = [
    { text: 'ID', datafield: 'id', width: 50 },
    { text: 'Nombre', datafield: 'nombre', width: 150 },
    { text: 'Email', datafield: 'email', width: 200 },
    { text: 'Acciones', datafield: 'acciones', width: 160, cellsrenderer: this.renderActions.bind(this) }
  ]

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      this.data = clientes
      this.source = {
        localdata: this.data,
        datafields: [
          { name: 'id', type: 'number' },
          { name: 'nombre', type: 'string' },
          { name: 'email', type: 'string' }
        ],
        datatype: 'array'
      }
      this.dataAdapter = new jqx.dataAdapter(this.source)
    })
  }

  renderActions(row: number): string {
    return `
      <button class="btn btn-primary action-ver" data-row="${row}">Ver</button>
      <button class="btn btn-success action-editar" data-row="${row}">Editar</button>
      <button class="btn btn-danger action-eliminar" data-row="${row}">Eliminar</button>
    `
  }

  handleActionClick(event: any): void {
    const target = event.target as HTMLElement
    const rowIndex = parseInt(target.getAttribute('data-row') || '', 10)

    if (target.classList.contains('action-ver')) {
      this.verCliente(rowIndex)
    } else if (target.classList.contains('action-editar')) {
      this.editarCliente(rowIndex)
    } else if (target.classList.contains('action-eliminar')) {
      this.eliminarCliente(rowIndex)
    }
  }

  verCliente(row: number): void {
    const cliente = this.data[row]
    this.clienteService.verCliente(cliente) // Emitir evento para ver al cliente en el mapa
  }

  editarCliente(row: number): void {
    const cliente = this.data[row]
    const nombre = prompt('Editar Nombre:', cliente.nombre)
    const email = prompt('Editar Email:', cliente.email)
    if (nombre && email) {
      const updatedCliente = { ...cliente, nombre, email }
      this.clienteService.editCliente(updatedCliente)
    }
  }

  eliminarCliente(row: number): void {
    const cliente = this.data[row]
    if (confirm(`¿Estás seguro de eliminar a ${cliente.nombre}?`)) {
      this.clienteService.deleteCliente(cliente.id)
    }
  }
}
