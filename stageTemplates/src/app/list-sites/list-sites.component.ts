import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteService } from '../services/site.service';
import { Site } from '../models/site';
import { MatDialog } from '@angular/material/dialog';
import { DeletingDialogComponent } from '../deleting-dialog/deleting-dialog.component';

@Component({
  selector: 'app-list-sites',
  templateUrl: './list-sites.component.html',
  styleUrls: ['./list-sites.component.css']
})
export class ListSiteComponent implements OnInit {
  sites: Site[] = [];
  filteredSites: Site[] = [];
  searchTerm: string = '';
  utilisateurconnecte: any | null = null;

  constructor(private dialog: MatDialog, private siteService: SiteService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const agenceId = +this.route.snapshot.paramMap.get('agenceId')!;
    this.loadSites(agenceId);
    this.getUtilisateur();
  }

  loadSites(agenceId: number): void {
    this.siteService.getAllSites().subscribe(
      sites => {
        this.sites = sites.filter(site => site.agenceId === agenceId);
        this.filteredSites = this.sites;
      },
      error => {
        console.error('Error fetching Sites:', error);
      }
    );
  }

  filterSites(): void {
    this.filteredSites = this.sites.filter(site => site.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  nav(siteId: number): void {
    localStorage.setItem('siteId', siteId.toString());
    this.router.navigate(['/detailBarrage']);
  }

  getUtilisateur(): void {
    this.utilisateurconnecte = localStorage.getItem('utilisateurconnecte');
    if (this.utilisateurconnecte !== null) {
      this.utilisateurconnecte = JSON.parse(this.utilisateurconnecte);
    } else {
      console.log('Erreur');
    }
  }

  canAccess(site: Site): boolean {
    if (this.utilisateurconnecte.role.designation === 'Admin') {
      // Admin peut accéder à tous les sites
      return true;
    } else if (this.utilisateurconnecte.role.designation === 'AdminAG') {
      // AdminAG peut aussi accéder à tous les sites
      return true;
    } else if (this.utilisateurconnecte.role.designation === 'AdminBAR') {
      // AdminBar ne peut accéder qu'à un site spécifique
      return this.utilisateurconnecte.siteId === site.id;
    }
    return false;
  }

  opendelGrDialog(id: number): void {
    const dialogRef = this.dialog.open(DeletingDialogComponent, {
      width: '500px',
      height: '325px',
      data: { "roleId": id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'roleDeleted') {
        this.loadSites(+this.route.snapshot.paramMap.get('agenceId')!);
      }
    });
  }

  sort(property: string): void {
    const sortOrder = (a: any, b: any) => (a[property] > b[property] ? 1 : (a[property] < b[property] ? -1 : 0));
    this.filteredSites.sort(sortOrder);
  }

  goToSettings(): void {
    this.router.navigate(['/crudSites']);
  }
}
