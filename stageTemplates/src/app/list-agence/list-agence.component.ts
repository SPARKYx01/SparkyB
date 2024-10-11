import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AgenceService } from '../services/agence.service';
import { Agence } from '../models/agence';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { GeocodingService } from '../services/geocodage.service';

@Component({
  selector: 'app-list-agence',
  templateUrl: './list-agence.component.html',
  styleUrls: ['./list-agence.component.css']
})
export class ListAgenceComponent implements OnInit, AfterViewInit {
  utilisateurconnecte: any | null = null;
  agences: Agence[] = [];
  filteredAgences: Agence[] = [];
  map!: L.Map;
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isMapExpanded: boolean = false;

  private agenceImages: { [key: string]: string } = {
    'agence sebou': 'assets/sebou.jpg',
    'agence loukkos': 'assets/loukkos.jpg',
    'agence bouregreg': 'assets/bouregreg.jpg',
    'agence guelmim oued noune': 'assets/guelmim-oued-noune.jpg',
    'agence oum rbie': 'assets/oum-rbie.jpg',
    'agence ziz guir': 'assets/ziz-guir.jpg',
    'agence melouya': 'assets/melouya.jpg',
    'agence sous massa': 'assets/sous-massa.jpg',
    'agence tansift': 'assets/tansift.jpg'
  };

  constructor(
    private agenceService: AgenceService, 
    private router: Router,
    private geocodingService: GeocodingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAgences();
    this.getUtilisateur();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  loadAgences(): void {
    this.agenceService.getAllAgences().subscribe(
      agences => {
        this.agences = agences;
        this.filteredAgences = [...this.agences];
        this.addMarkers();
      },
      error => {
        console.error('Error fetching Agences:', error);
      }
    );
  }

  getUtilisateur(): void {
    const storedUser = localStorage.getItem('utilisateurconnecte');
    this.utilisateurconnecte = storedUser ? JSON.parse(storedUser) : null;
  }

  canAccess(agence: Agence): boolean {
    if (!this.utilisateurconnecte) return false;
    return (
      this.utilisateurconnecte.agenceId === agence.id ||
      (this.utilisateurconnecte.site && this.utilisateurconnecte.site.agenceId === agence.id) ||
      this.utilisateurconnecte.role.designation === 'Admin'
    );
  }

  nav(agenceId: number): void {
    localStorage.setItem('agenceId', agenceId.toString());
    this.router.navigate(['/listSites', agenceId]);
  }

  initMap(): void {
    const moroccoBounds: L.LatLngBoundsExpression = [[21.32707, -17.06239], [36.05078, -0.99837]];

    this.map = L.map('map', {
      maxBounds: moroccoBounds,
      maxBoundsViscosity: 1.0
    }).setView([31.7917, -7.0926], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  addMarkers(): void {
    const redIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.agences.forEach(agence => {
      if (agence.latitude && agence.longitude) {
        const marker = L.marker([agence.latitude, agence.longitude], { icon: redIcon });
        marker.addTo(this.map);
        marker.bindPopup(`<b>${agence.ville}</b><br>${agence.nom}`);
      }
    });
  }

  filterAgences(): void {
    this.filteredAgences = this.agences.filter(agence =>
      agence.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      agence.ville.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredAgences.sort((a, b) => {
      const aValue = (a as any)[column].toLowerCase();
      const bValue = (b as any)[column].toLowerCase();
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  showOnMap(agence: Agence): void {
    this.isMapExpanded = true;
    this.changeDetectorRef.detectChanges();

    this.geocodingService.getAgenceLocation(agence.nom, agence.ville).subscribe(
      ([lat, lng]) => {
        this.map.setView([lat, lng], 12);

        const imageUrl = this.agenceImages[agence.nom.toLowerCase()] || 'assets/images/agences/default.jpg';

        const popupContent = `
          <div class="custom-popup">
            <img src="${imageUrl}" alt="Agence ${agence.nom}" style="width:100%; max-width:150px; height:auto; border-radius:5px; margin-bottom:5px;">
            <h2>${agence.nom}</h2>
            <p><strong>Ville:</strong> ${agence.ville}</p>
            <p><strong>Adresse:</strong> [Adresse de l'agence]</p>
            <p><strong>Téléphone:</strong>06 04 39 27 94</p>
            <a href="[Site web de l'agence]" target="_blank" class="btn btn-primary btn-sm">Visiter le site web</a>
          </div>
        `;

        L.marker([lat, lng], { icon: this.customIcon })
          .addTo(this.map)
          .bindPopup(popupContent, {
            maxWidth: 200,
            className: 'custom-popup'
          })
          .openPopup();

        this.map.invalidateSize();
      },
      error => {
        console.error('Erreur lors de la géolocalisation :', error);
      }
    );
    
  }

  reduceMap(): void {
    this.isMapExpanded = false;
    this.changeDetectorRef.detectChanges();
    this.map.invalidateSize();
  }

  private customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#c30b82;' class='marker-pin'></div><i class='material-icons'>place</i>",
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
  goToSet(): void {
    this.router.navigate(['/crudSites']);
  }
}
