import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  coordenadas: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clientesSubject: BehaviorSubject<Cliente[]> = new BehaviorSubject<Cliente[]>([]);
  public clientes$: Observable<Cliente[]> = this.clientesSubject.asObservable();

  private verClienteSubject: Subject<Cliente> = new Subject<Cliente>();
  public verCliente$: Observable<Cliente> = this.verClienteSubject.asObservable();

  constructor() {
    const initialClientes: Cliente[] = [
      { id: 1, nombre: 'Cliente 1', email: 'cliente1@example.com', coordenadas: [-1.1305, 37.9924] },
      { id: 2, nombre: 'Cliente 2', email: 'cliente2@example.com', coordenadas: [-1.1310, 37.9930] }
    ];
    this.clientesSubject.next(initialClientes);
  }

  getClientesSubject(): BehaviorSubject<Cliente[]> {
    return this.clientesSubject;
  }

  getClientes(): Observable<Cliente[]> {
    return this.clientes$;
  }

  addCliente(cliente: Cliente): void {
    const currentClientes = this.clientesSubject.getValue();
    this.clientesSubject.next([...currentClientes, cliente]);
  }

  editCliente(updatedCliente: Cliente): void {
    const currentClientes = this.clientesSubject.getValue().map(cliente =>
      cliente.id === updatedCliente.id ? updatedCliente : cliente
    );
    this.clientesSubject.next(currentClientes);
  }

  deleteCliente(clienteId: number): void {
    const currentClientes = this.clientesSubject.getValue().filter(cliente => cliente.id !== clienteId);
    this.clientesSubject.next(currentClientes);
  }

  verCliente(cliente: Cliente): void {
    this.verClienteSubject.next(cliente);
  }
}
