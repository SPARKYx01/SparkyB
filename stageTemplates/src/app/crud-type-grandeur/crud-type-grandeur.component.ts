import { Component, OnInit } from '@angular/core';
import { Grandeur } from '../models/grandeur';
import { GrandeurService } from '../services/grandeur.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditPropGrandeurDialogComponent } from '../edit-prop-grandeur-dialog/edit-prop-grandeur-dialog.component';
import { AddTypeGrandeurDialogComponent } from '../add-type-grandeur-dialog/add-type-grandeur-dialog.component';
import { TypeGrandeur } from '../models/typegrandeur';
import { SiteGrandeur } from '../models/sitegrandeur';
import { SiteGrandeurService } from '../services/sitegrandeur.service';
import { TypeGrandeurService } from '../services/typegrandeur.service';
import { DeletingDialogComponent } from '../deleting-dialog/deleting-dialog.component';
interface AdminSideNavToggle {
  screenWidth: number;
  collapsed : boolean;
}
@Component({
  selector: 'app-crud-type-grandeur',
  templateUrl: './crud-type-grandeur.component.html',
  styleUrls: ['./crud-type-grandeur.component.css']
})
export class CrudTypeGrandeurComponent implements OnInit {
  typesgrandeurs: TypeGrandeur[] = [];
  sitesGrandeurs : SiteGrandeur[] = [];
  isSideNavCollapsed = false;
  screenWidth = 0;
  itemsPerPage: number=5;
  p:number=1;
  onToggleSideNav(data:AdminSideNavToggle): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  constructor(private typeGrandeurService: TypeGrandeurService, private siteGrandeurService: SiteGrandeurService,private route: ActivatedRoute,public dialog: MatDialog) { }
  ngOnInit(): void {
    this.getAllSitesGrandeur();
   
  }
  addTypeGrandeur(): void {
    const siteId = this.route.snapshot.params['siteId']; // Assuming you get the site ID from the route parameters
    const dialogRef = this.dialog.open(AddTypeGrandeurDialogComponent, {
      width: '700px',
      height: '700px',
      data: { siteId: siteId }
    });
  
  
    /*dialogRef.afterClosed().subscribe(result => {
      if (result === 'grandeurUpdated') {
       // Manually refresh the user data
      }
    });*/
  }
/*EditSiteGrandeur(id:number): void {
    const dialogRef = this.dialog.open(EditTypeGrandeurDialogComponent, {
      width: '700px',
      height:'700px',
      data : {'siteGrandeurId' : id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'TypeGrandeurUpdated') {
      this.getAllSitesGrandeur();
      }
    });
  }*/
        getAllTypesGrandeur(): void {
      this.typeGrandeurService.getAllTypeGrandeurs().subscribe(
        typesGrandeurs => {
          this.typesgrandeurs = typesGrandeurs;

        } ,
        error => {
          console.error('Error fetching typesGrandeur', error);
        }
      );
      }
      getAllSitesGrandeur(): void {
        this.siteGrandeurService.getAllSiteGrandeurs().subscribe(
          sitesGrandeurs => {
            this.sitesGrandeurs = sitesGrandeurs;
  
          },
          error => {
            console.error('Error fetching sitesGrandeur', error);
          }
        );
      }
      opendelGrDialog(siteId:number,typeGrandeurId:number): void {
        const dialogRef = this.dialog.open(DeletingDialogComponent, {
           width: '500px',
           height:'325px',
           data: {"siteGrandeurSiteId":siteId,"siteGrandeurtypeGrandeurId":typeGrandeurId}
           
         });
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'siteGrandeurDeleted') {
              this.getAllSitesGrandeur();
            }
          });
      
       }
}
