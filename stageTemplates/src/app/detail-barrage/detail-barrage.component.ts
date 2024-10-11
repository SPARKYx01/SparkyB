import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditSiteDialogComponent } from '../edit-site-dialog/edit-site-dialog.component';
import { Router } from '@angular/router';
import { SiteService } from '../services/site.service';
import { Site } from '../models/site';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-detail-barrage',
  templateUrl: './detail-barrage.component.html',
  styleUrls: ['./detail-barrage.component.css']
})
export class DetailBarrageComponent implements OnInit {
  siteId = Number(localStorage.getItem('siteId'));
  site: Site | undefined;
  isSideNavCollapsed = false;
  screenWidth = 0;

  siteFields = [
    { label: 'Nom', value: '' },
    { label: 'Localisation', value: '' },
    { label: 'Type de Site', value: '' },
    { label: 'Capacité', value: '' },
    { label: 'Ville Plus Proche', value: '' },
    { label: 'Hauteur de Barrage', value: '' },
    { label: 'Distance de Ville Plus Proche', value: '' },
    { label: 'Code Retenue Normal', value: '' },
    { label: 'Date Mise En Service', value: '' },
    { label: 'La Retenue', value: '' },
  ];

  constructor(
    public dialog: MatDialog,
    private siteService: SiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSiteById(this.siteId);
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditSiteDialogComponent, {
      width: '700px',
      height: '700px',
      data: { siteId: this.siteId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'siteUpdated') {
        this.loadSiteById(this.siteId); // Actualiser les données du site
      }
    });
  }

  loadSiteById(id: number): void {
    this.siteService.getBarrageById(id).subscribe(
      site => {
        this.site = site;
        this.updateSiteFields();
      },
      error => {
        console.error('Erreur lors de la récupération des détails du site :', error);
      }
    );
  }

  updateSiteFields(): void {
    if (this.site) {
      this.siteFields = [
        { label: 'Nom', value: this.site.nom },
        { label: 'Localisation', value: this.site.localisationBarr },
        { label: 'Type de Site', value: this.site.type },
        { label: 'Capacité', value: this.site.capacite?.toString() || '' },
        { label: 'Ville Plus Proche', value: this.site.villePlusProche },
        { label: 'Hauteur de Barrage', value: this.site.hauteurBarr?.toString() || '' },
        { label: 'Distance de Ville Plus Proche', value: this.site.distVillePlusProche?.toString() || ''  },
        { label: 'Code Retenue Normal', value: this.site.codeRetNormal },
        { label: 'Date Mise En Service', value: this.site.dateMiseEnServ ? new Date(this.site.dateMiseEnServ).toLocaleDateString() : '' },
        { label: 'La Retenue', value: this.site.laRetenue },
      ];
    }
  }

  goBackToSites(): void {
    this.router.navigate(['/listSites/1']);
  }

  goBackToAgencies(): void {
    this.router.navigate(['/listAgences/']);
  }
}
