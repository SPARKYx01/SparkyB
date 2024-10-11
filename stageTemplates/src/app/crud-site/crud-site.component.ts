import { Component, OnInit } from '@angular/core';
import { Site } from '../models/site';
import { SiteService } from '../services/site.service';
import { MatDialog } from '@angular/material/dialog';
import { EditSiteDialogComponent } from '../edit-site-dialog/edit-site-dialog.component';
import { DeletingDialogComponent } from '../deleting-dialog/deleting-dialog.component';
import { AddSiteDialogComponent } from '../add-site-dialog/add-site-dialog.component';
import { LogService, Journal } from '../services/log.service'; // Import du service de journalisation

interface AdminSideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-crud-site',
  templateUrl: './crud-site.component.html',
  styleUrls: ['./crud-site.component.css']
})
export class CrudSiteComponent implements OnInit {
  sites: Site[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private siteService: SiteService, private dialog: MatDialog, private logService: LogService) {}

  ngOnInit(): void {
    this.getAllSites();
  }

  onToggleSideNav(data: AdminSideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getAllSites(): void {
    this.siteService.getAllBarrages().subscribe(
      sites => {
        this.sites = sites;
      },
      error => {
        console.error('Error fetching sites:', error);
      }
    );
  }

  openEditSiteDialog(id: number): void {
    const dialogRef = this.dialog.open(EditSiteDialogComponent, {
      width: '700px',
      height: '700px',
      data: { siteId: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'siteUpdated') {
        this.getAllSites();

        // Enregistrement du journal pour la modification
        const journal: Journal = {
          date: new Date(),
          action: 'Modification',
          utilisateur: 'Admin', // Remplacez par l'utilisateur connecté
          barrage: id.toString()
        };
        this.logService.enregistrerJournal(journal).subscribe();
      }
    });
  }

  openAddSiteDialog(): void {
    const dialogRef = this.dialog.open(AddSiteDialogComponent, {
      width: '700px',
      height: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'siteCreated') {
        this.getAllSites();

        // Enregistrement du journal pour l'ajout
        const journal: Journal = {
          date: new Date(),
          action: 'Création',
          utilisateur: 'Admin', // Remplacez par l'utilisateur connecté
          barrage: 'Nouveau site ajouté'
        };
        this.logService.enregistrerJournal(journal).subscribe();
      }
    });
  }

  opendelGrDialog(id: number): void {
    const dialogRef = this.dialog.open(DeletingDialogComponent, {
      width: '500px',
      height: '325px',
      data: { siteId: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'siteDeleted') {
        this.getAllSites();

        // Enregistrement du journal pour la suppression
        const journal: Journal = {
          date: new Date(),
          action: 'Suppression',
          utilisateur: 'Admin', // Remplacez par l'utilisateur connecté
          barrage: id.toString()
        };
        this.logService.enregistrerJournal(journal).subscribe();
      }
    });
  }
}