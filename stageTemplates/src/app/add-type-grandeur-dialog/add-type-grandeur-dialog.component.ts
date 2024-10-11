import { Component,OnInit } from '@angular/core';
import { Site } from '../models/site';
import { SiteGrandeur } from '../models/sitegrandeur';
import { TypeGrandeur } from '../models/typegrandeur';
import { TypeGrandeurService } from '../services/typegrandeur.service';
import { SiteGrandeurService } from '../services/sitegrandeur.service';

@Component({
  selector: 'app-add-type-grandeur-dialog',
  templateUrl: './add-type-grandeur-dialog.component.html',
  styleUrls: ['./add-type-grandeur-dialog.component.css']
})
export class AddTypeGrandeurDialogComponent implements OnInit {
  siteGrandeur : SiteGrandeur = new SiteGrandeur(0,0);
  typeGrandeur : TypeGrandeur = new TypeGrandeur(0,"");
  sites : Site[] = [];
  typesGrandeurs: TypeGrandeur[]= [];
 constructor(private typeGrandeurService: TypeGrandeurService,private siteGrandeurService: SiteGrandeurService){
 }
 ngOnInit(): void {  
   this.getAllTypesGrandeurs();
   this.siteGrandeur.siteId=Number(localStorage.getItem("siteId"));
 }

getAllTypesGrandeurs(): void {
  this.typeGrandeurService.getAllTypeGrandeurs().subscribe(
    typesGrandeurs => {
      this.typesGrandeurs = typesGrandeurs;
    },
    error => {
      console.error('Error fetching TypesGrandeurs:', error);
    }
  );
}
ajouterSiteGrandeur(siteGrandeur: SiteGrandeur) :void
{
  this.siteGrandeurService.createSiteGrandeur(siteGrandeur).subscribe(
    (response: any) => {
      console.log(response)
    },
    (error) => {
      // Handle login error here if necessary
      console.error('Post error:', error);
    }
  );
}
ajouterTypeGrandeur(typeGrandeur : TypeGrandeur) :void
{
  this.typeGrandeurService.createTypeGrandeur(typeGrandeur).subscribe(
    (response: any) => {
      console.log(response)
    },
    (error) => {
      // Handle login error here if necessary
      console.error('Post error:', error);
    }
  );
}

}