import { AfterViewInit, Component } from '@angular/core'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {fromLonLat, toLonLat} from 'ol/proj'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import Overlay from 'ol/Overlay'
import { ClienteService, Cliente } from '../../services/cliente.service'
import { TablaClientesComponent } from '../tabla-clientes/tabla-clientes.component'
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component'
import { NgIf } from "@angular/common"

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  standalone: true,
  imports: [
    TablaClientesComponent,
    FormularioClienteComponent,
    NgIf
  ],
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements AfterViewInit {

  public showClientsTable: boolean = false // Controla la visibilidad del componente "Ver Clientes"
  public showCreateClient: boolean = false // Controla la visibilidad del componente "Crear Cliente"
  private map: Map | undefined
  private overlay: Overlay | undefined
  private vectorSource: VectorSource = new VectorSource()
  private clienteSeleccionado: Cliente | null = null
  private isMovingClient: boolean = false

  constructor(private clienteService: ClienteService) { }

  ngAfterViewInit(): void {
    this.initMap()
    this.addClientButtonListeners()

    // Suscribirse a los cambios en la lista de clientes
    this.clienteService.getClientes().subscribe(clientes => {
      this.addClientMarkers(clientes)
    })

    // Suscribirse al evento de ver cliente
    this.clienteService.verCliente$.subscribe(cliente => {
      this.verClienteEnMapa(cliente)
    })

    // Manejar el clic en el botón "Mover Cliente"
    const moveClientButton = document.getElementById('move-client-btn')
    moveClientButton?.addEventListener('click', () => this.startMovingClient())
  }

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: this.vectorSource
        })
      ],
      view: new View({
        center: fromLonLat([-1.1306126900186688, 37.99236284533088]),
        zoom: 13
      })
    })

    // Crear el overlay para el popup
    const container = document.getElementById('popup')!
    const content = document.getElementById('popup-content')!
    const closer = document.getElementById('popup-closer')!

    this.overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        }
      },
    })
    this.map.addOverlay(this.overlay)

    // Cerrar el popup cuando se hace clic en la "X"
    closer.onclick = () => {
      this.overlay?.setPosition(undefined)
      this.isMovingClient = false
      this.clienteSeleccionado = null
      closer.blur()
      return false
    }

    // Manejar el clic en el mapa para mover el cliente
    this.map.on('singleclick', (event) => {
      if (this.isMovingClient && this.clienteSeleccionado) {
        const coordinates = event.coordinate
        this.updateClientePosition(this.clienteSeleccionado, coordinates)
        this.isMovingClient = false
        this.overlay?.setPosition(undefined)
      } else {
        const feature = this.map?.forEachFeatureAtPixel(event.pixel, (feature) => {
          return feature
        })

        if (!feature) {
          this.overlay?.setPosition(undefined)
        }
      }
    })
  }

  private addClientMarkers(clientes: Cliente[]): void {
    this.vectorSource.clear() // Limpiar los marcadores existentes antes de añadir los nuevos

    clientes.forEach(cliente => {
      this.addMarker(cliente)
    })
  }

  private addMarker(cliente: Cliente): void {
    // Transformar las coordenadas geográficas (EPSG:4326) a las coordenadas del mapa (EPSG:3857)
    const coordinates = fromLonLat(cliente.coordenadas)

    const feature = new Feature({
      geometry: new Point(coordinates),
      name: cliente.nombre,
      id: cliente.id,
      email: cliente.email
    })

    feature.setStyle(new Style({
      image: new Icon({
        src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg',
        anchor: [0.5, 1]
      })
    }))

    this.vectorSource.addFeature(feature)
  }

  private verClienteEnMapa(cliente: Cliente): void {
    this.clienteSeleccionado = cliente
    const feature = this.vectorSource.getFeatures().find(f => f.get('id') === cliente.id)
    if (feature) {
      const coordinates = (feature.getGeometry() as Point).getCoordinates()
      const content = document.getElementById('popup-content')!
      content.innerHTML = `<p><strong>${cliente.nombre}</strong></p><p>ID: ${cliente.id}</p><p>Email: ${cliente.email}</p>`
      this.overlay?.setPosition(coordinates)
    }
  }

  private startMovingClient(): void {
    if (this.clienteSeleccionado) {
      this.isMovingClient = true
      alert('Haz clic en el mapa para seleccionar la nueva posición del cliente.')
    }
  }

  private updateClientePosition(cliente: Cliente, newCoordinates: number[]): void {
    // Transformar las coordenadas del mapa (EPSG:3857) a coordenadas geográficas (EPSG:4326)
    const transformedCoordinates = toLonLat(newCoordinates)

    // Actualizar las coordenadas del cliente
    cliente.coordenadas = [transformedCoordinates[0], transformedCoordinates[1]]
    this.clienteService.editCliente(cliente) // Actualizar el cliente en el servicio

    // Obtener la lista actualizada de clientes y actualizar los marcadores en el mapa
    const clientesActualizados = this.clienteService.getClientesSubject().getValue()
    this.addClientMarkers(clientesActualizados) // Actualizar los marcadores en el mapa

    alert('La posición del cliente ha sido actualizada.')
  }


  private addClientButtonListeners(): void {
    const showClientsButton = document.getElementById('show-clients-btn')
    const showCreateClientButton = document.getElementById('show-create-client-btn')

    if (showClientsButton) {
      showClientsButton.addEventListener('click', () => {
        this.showClientsTable = !this.showClientsTable
        this.showCreateClient = false // Ocultar el formulario de creación si está visible
      })
    }

    if (showCreateClientButton) {
      showCreateClientButton.addEventListener('click', () => {
        this.showCreateClient = !this.showCreateClient
        this.showClientsTable = false // Ocultar la tabla de clientes si está visible
      })
    }
  }
}
