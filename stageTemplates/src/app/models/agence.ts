export class Agence {
    [x: string]: any;
    id: number=0;
    nom: string="";
    ville: string="";
    latitude?: number;
    longitude?: number;
  
    constructor(id: number = 0, nom: string = "", ville: string = "",latitude?: number, longitude?: number) {
      this.id = id;
      this.nom = nom;
      this.ville = ville;
      this.latitude = latitude;
      this.longitude = longitude;
      
    }}