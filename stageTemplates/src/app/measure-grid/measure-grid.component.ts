import { Component, OnInit, QueryList, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { GrandeurService } from '../services/grandeur.service';
import { MesureService } from '../services/mesure.service';
import { Grandeur } from '../models/grandeur';
import { Mesure } from '../models/mesure';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ActivatedRoute } from '@angular/router';

HighchartsMore(Highcharts);
Highcharts3D(Highcharts);
interface SideNavToggle {
  screenWidth: number;
  collapsed : boolean;
}
@Component({
  selector: 'app-measure-grid',
  templateUrl: './measure-grid.component.html',
  styleUrls: ['./measure-grid.component.css']
})
export class MeasureGridComponent implements OnInit, AfterViewInit {
  grandeurs: Grandeur[] = [];
  mesureGrid: any[] = [];
  newDate: string = '';
  @ViewChildren('inputField') inputs!: QueryList<ElementRef>;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions2D: Highcharts.Options = {};
  chartOptions3D: Highcharts.Options = {};
  showChart2D: boolean = false;
  showChart3D: boolean = false;
  mesures: any[] = [];  
  siteId: number;
  
  constructor(
    private grandeurService: GrandeurService,
    private mesureService: MesureService,
    private route: ActivatedRoute
  ) {
    this.siteId = Number(localStorage.getItem('siteId'));
  }
 
  ngOnInit(): void {
    const typeGrandeurId = +this.route.snapshot.paramMap.get('typeGrandeurId')!;
    this.getAllGrandeursByTypeGrandeur(typeGrandeurId);
  }
  
  ngAfterViewInit(): void {
    // Code d'initialisation si nécessaire
  }

  getAllGrandeursByTypeGrandeur(id: number): void {
    this.grandeurService.getByTypeGrandeur(id).subscribe(grandeurs => {
      console.log('Toutes les grandeurs:', grandeurs);
      // Filtrer les grandeurs par siteId
      this.grandeurs = grandeurs.filter(grandeur => grandeur.siteId === this.siteId);
      console.log('Grandeurs filtrées par site:', this.grandeurs);
      
      this.mesures = [];
      this.grandeurs.forEach(grandeur => {
        if (grandeur.mesures) {  
          this.mesures.push(...grandeur.mesures);
        }
      });

      this.initializeGrid(this.mesures);
    });
  }

  initializeGrid(mesures: Mesure[]): void {
    console.log("Initialisation de la grille avec les mesures:", mesures);
    const groupedMeasures: { [key: string]: any } = {};
    mesures.forEach(mesure => {
      const dateStr = new Date(mesure.date).toLocaleDateString('en-CA');
      if (!groupedMeasures[dateStr]) {
        groupedMeasures[dateStr] = { date: dateStr, mesures: {} };
      }
      groupedMeasures[dateStr].mesures[mesure.grandeurId] = mesure;
    });
    this.mesureGrid = Object.values(groupedMeasures);
    this.sortMeasureGridByDate();
    this.saveGridToLocalStorage();
  }


  getMeasureValue(row: any, grandeurId: number): number {
    return row.mesures[grandeurId]?.valeur || null;
  }

  setMeasureValue(row: any, grandeurId: number, value: number): void {
    if (!row.mesures[grandeurId]) {
      row.mesures[grandeurId] = { valeur: null };
    }
    row.mesures[grandeurId].valeur = value;
  }

  saveRow(row: any): void {
    const date = new Date(row.date);
    Object.keys(row.mesures).forEach(grandeurId => {
      const mesure = row.mesures[grandeurId];
      if (mesure.valeur !== null && mesure.valeur !== undefined) {
        const newMesure = new Mesure(mesure.id || 0, date, mesure.valeur, +grandeurId);

        if (mesure.id) {
          this.mesureService.updateMesure(newMesure).subscribe(
            response => console.log('Mesure mise à jour:', response),
            error => console.error('Erreur lors de la mise à jour de la mesure:', error)
          );
        } else {
          this.mesureService.createMesure(newMesure).subscribe(
            createdMesure => {
              console.log('Mesure créée:', createdMesure);
              row.mesures[grandeurId] = createdMesure;
            },
            error => console.error('Erreur lors de la création de la mesure:', error)
          );
        }
      }
    });
    this.saveGridToLocalStorage();
  }

  deleteRow(row: any): void {
    const dateStr = new Date(row.date).toLocaleDateString('en-CA');
    Object.values(row.mesures).forEach((mesure: any) => {
      if (mesure.id) {
        this.mesureService.deleteMesure(mesure.id).subscribe(
          () => console.log(`Mesure avec ID ${mesure.id} supprimée`),
          error => console.error('Erreur lors de la suppression de la mesure:', error)
        );
      }
    });

    const index = this.mesureGrid.indexOf(row);
    if (index !== -1) {
      this.mesureGrid.splice(index, 1);
    }
    this.sortMeasureGridByDate();
    this.saveGridToLocalStorage();
  }

  addNewRow(): void {
    const today = new Date().toLocaleDateString('en-CA');
    this.mesureGrid.push({ date: today, mesures: {} });
    this.sortMeasureGridByDate();
    this.saveGridToLocalStorage();
  }

  saveAllRows(): void {
    for (let row of this.mesureGrid) {
      this.saveRow(row);
    }
  }

  sortMeasureGridByDate(): void {
    this.mesureGrid.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  handleKeydown(event: KeyboardEvent, rowIndex: number, colIndex: number): void {
    const inputArray = this.inputs.toArray();
    const columns = this.grandeurs.length + 1;
    let currentIndex = rowIndex * columns + colIndex;

    if (event.key === 'ArrowRight') {
      currentIndex++;
    } else if (event.key === 'ArrowLeft') {
      currentIndex--;
    } else if (event.key === 'ArrowDown') {
      currentIndex += columns;
    } else if (event.key === 'ArrowUp') {
      currentIndex -= columns;
    }

    if (currentIndex >= 0 && currentIndex < inputArray.length) {
      inputArray[currentIndex].nativeElement.focus();
    }
  }

  saveGridToLocalStorage(): void {
    localStorage.setItem('mesureGrid', JSON.stringify(this.mesureGrid));
  }

  loadGridFromLocalStorage(): void {
    const savedGrid = localStorage.getItem('mesureGrid');
    if (savedGrid) {
      this.mesureGrid = JSON.parse(savedGrid);
      this.sortMeasureGridByDate();
    }
  }

  trackByRowIndex(index: number, item: any): number {
    return index;
  }

  trackByGrandeurId(index: number, item: any): number {
    return item.id;
  }

  showGraph2D(): void {
    this.showChart2D = true;
    const series = this.grandeurs.map(grandeur => ({
      name: grandeur.nomAbrege,
      data: this.mesureGrid.map(row => this.getMeasureValue(row, grandeur.id))
    }));

    this.chartOptions2D = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Mesures 2D'
      },
      xAxis: {
        categories: this.mesureGrid.map(row => row.date)
      },
      yAxis: {
        title: {
          text: 'Valeur'
        },
        min: 0  // Set the minimum value of the y-axis to 0
      },
      series: series as any
    };
  }
  showGraph3D(): void {
    this.showChart3D = true;
  
    const series = this.grandeurs.map(grandeur => ({
      name: grandeur.nomAbrege,
      data: this.mesureGrid.map((row, index) => [index, this.getMeasureValue(row, grandeur.id), this.grandeurs.indexOf(grandeur)]),
      type: 'area',
      lineWidth: 1,
      fillOpacity: 0.5,
      marker: {
        enabled: true
      }
     
    }));
  
    this.chartOptions3D = {
      chart: {
        type: 'area',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        }
      },
      title: {
        text: 'Mesures 3D'
      },
      xAxis: {
        title: {
          text: 'Date'
        },
        categories: this.mesureGrid.map(row => row.date), // Utilisation des dates réelles
        labels: {
          formatter: function () {
            return String(this.value); // Forcer le retour à une chaîne de caractères
          }
        }
      },
      yAxis: {
        title: {
          text: 'Valeur'
        }
      },
      zAxis: {
        title: {
          text: 'Grandeur'
        }
      },
      tooltip: {
        enabled: true,
        shared: false,
        animation: false,
        formatter: function () {
          return `<b>${this.series.name}</b><br/>Date: ${this.x}<br/>Valeur: ${this.y}`;
        }
      },
      plotOptions: {
        area: {
          stacking: undefined,
          marker: {
            radius: 5
          },
          lineWidth: 1
        }
      },
      series: series as any
    };
  }
}  
  
  
