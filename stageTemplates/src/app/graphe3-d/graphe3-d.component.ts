import { Component, OnInit } from '@angular/core';
import { GrandeurService } from '../services/grandeur.service';
import { TypeGrandeurService } from '../services/typegrandeur.service';
import { Mesure } from '../models/mesure';
import { Grandeur } from '../models/grandeur';
import { TypeGrandeur } from '../models/typegrandeur';
import { forkJoin } from 'rxjs';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_annotations from 'highcharts/modules/annotations';

HC_more(Highcharts);
HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_accessibility(Highcharts);
HC_annotations(Highcharts);

@Component({
  selector: 'app-graphe3-d',
  templateUrl: './graphe3-d.component.html',
  styleUrls: ['./graphe3-d.component.css']
})
export class Graphe3DComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions3D: Highcharts.Options = {};
  showChart3D: boolean = false;
  chartOptions: Highcharts.Options = {};
  showChart: boolean = false;
  updateFlag: boolean = false;

  grandeurs: Grandeur[] = [];
  mesures: Mesure[] = [];
  typeGrandeurs: TypeGrandeur[] = [];
  selectedTypeGrandeurs: number[] = [];
  siteId: number;  
  mesureGrid: any[] = [];
  uniqueTypeGrandeurs: TypeGrandeur[] = [];

  constructor(
    private grandeurService: GrandeurService,
    private typeGrandeurService: TypeGrandeurService
  ) {
    this.siteId = Number(localStorage.getItem('siteId'));
   }

  ngOnInit(): void {
    this.loadTypeGrandeurs();
  }

  loadTypeGrandeurs(): void {
    this.typeGrandeurService.getAllTypeGrandeurs().subscribe(typeGrandeurs => {
      const uniqueTypeGrandeursSet = new Set(typeGrandeurs.map(tg => JSON.stringify(tg)));
      this.uniqueTypeGrandeurs = Array.from(uniqueTypeGrandeursSet).map(tgString => JSON.parse(tgString));
    });
  }

  onTypeGrandeurChange(typeGrandeurId: number): void {
    const index = this.selectedTypeGrandeurs.indexOf(typeGrandeurId);
    if (index > -1) {
      this.selectedTypeGrandeurs.splice(index, 1);
    } else {
      this.selectedTypeGrandeurs.push(typeGrandeurId);
    }
  }

  afficherTableau(): void {
    if (this.selectedTypeGrandeurs.length === 2) {
      this.getAllGrandeursByTypeGrandeur();
    } else {
      alert('Veuillez sélectionner exactement deux types de grandeur.');
    }
  }

  getAllGrandeursByTypeGrandeur(): void {
    this.grandeurs = [];
    this.mesures = [];

    const requests = this.selectedTypeGrandeurs.map(typeGrandeurId =>
      this.grandeurService.getByTypeGrandeur(typeGrandeurId)
    );

    forkJoin(requests).subscribe(results => {
      results.forEach(grandeursOfType => {
        if (grandeursOfType) {
          const filteredGrandeurs = grandeursOfType.filter(grandeur => grandeur.siteId === this.siteId);
          this.grandeurs.push(...filteredGrandeurs);

          filteredGrandeurs.forEach(grandeur => {
            if (grandeur.mesures) {
              this.mesures.push(...grandeur.mesures);
            }
          });
        }
      });

      this.mesures = this.mesures.filter(m => m.valeur != null);
      this.mesures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.initializeGrid(this.mesures);
      this.generateChart3D();
    });
  }

  initializeGrid(mesures: Mesure[]): void {
    const groupedMeasures: { [key: string]: any } = {};
    mesures.forEach(mesure => {
      const dateStr = new Date(mesure.date).toLocaleDateString('en-CA');
      if (!groupedMeasures[dateStr]) {
        groupedMeasures[dateStr] = { date: dateStr, mesures: {} };
      }
      groupedMeasures[dateStr].mesures[mesure.grandeurId] = mesure;
    });
    this.mesureGrid = Object.values(groupedMeasures);
    this.mesureGrid.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  
  
  generateChart3D(): void {
    if (this.selectedTypeGrandeurs.length !== 2 || this.mesureGrid.length === 0) {
      console.error('Données insuffisantes pour générer le graphique');
      return;
    }
  
    const typeGrandeur1 = this.uniqueTypeGrandeurs.find(tg => tg.id === this.selectedTypeGrandeurs[0]);
    const typeGrandeur2 = this.uniqueTypeGrandeurs.find(tg => tg.id === this.selectedTypeGrandeurs[1]);
  
    if (!typeGrandeur1 || !typeGrandeur2) {
      console.error('Types de grandeur non trouvés');
      return;
    }
  
    const grandeursType1 = this.grandeurs.filter(g => g.typeGrandeurId === typeGrandeur1.id);
    const grandeursType2 = this.grandeurs.filter(g => g.typeGrandeurId === typeGrandeur2.id);
  
    const series: Highcharts.SeriesOptionsType[] = [];
  
    let maxValueType1 = 0;
    let maxValueType2 = 0;
  
    // Créer des séries pour le type 1 (axe Y gauche) - Lignes solides avec remplissage
    grandeursType1.forEach(grandeur => {
      const data = this.mesureGrid.map(row => {
        const date = new Date(row.date).getTime();
        const value = this.getMeasureValue(row, grandeur.id) || 0;
        maxValueType1 = Math.max(maxValueType1, value);
        return [date, value];
      });
      series.push({
        name: `${grandeur.nomAbrege || ''} (${typeGrandeur1.nom})`,
        data: data,
        type: 'area',
        yAxis: 0,
        color: Highcharts.getOptions().colors![series.length % Highcharts.getOptions().colors!.length],
        fillOpacity: 0.3,
        lineWidth: 2
      });
    });
  
    // Créer des séries pour le type 2 (axe Y droit) - Lignes pointillées avec remplissage
    grandeursType2.forEach(grandeur => {
      const data = this.mesureGrid.map(row => {
        const date = new Date(row.date).getTime();
        const value = this.getMeasureValue(row, grandeur.id) || 0;
        maxValueType2 = Math.max(maxValueType2, value);
        return [date, value];
      });
      series.push({
        name: `${grandeur.nomAbrege || ''} (${typeGrandeur2.nom})`,
        data: data,
        type: 'area',
        yAxis: 1,
        dashStyle: 'Dash',
        color: Highcharts.getOptions().colors![(series.length + 3) % Highcharts.getOptions().colors!.length],
        fillOpacity: 0.1,
        lineWidth: 2
      });
    });
  
    maxValueType1 = Math.ceil(maxValueType1 / 100) * 100;
    maxValueType2 = Math.ceil(maxValueType2 / 10) * 10;
  
    this.chartOptions3D = {
      chart: {
        type: 'area',
        panning: {
          enabled: true,
          type: 'xy'  // Allows panning on both axes
        },
        animation: {
          duration: 1000
        },
        panKey: 'shift',
        zooming: {
          type: 'xy'  // Enable zooming on both axes
        },
       
      },
      title: {
        text: 'Mesures avec double axe Y'
      },
      subtitle: {
        text: `${typeGrandeur1.nom} (lignes solides) et ${typeGrandeur2.nom} (lignes pointillées)`
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        }
      },
      yAxis: [{
        title: {
          text: typeGrandeur1.nom
        },
        min: 0,
        max: maxValueType1,
        startOnTick: false,
        endOnTick: false
      }, {
        title: {
          text: typeGrandeur2.nom
        },
        min: 0,
        max: maxValueType2,
        opposite: true,
        startOnTick: false,
        endOnTick: false
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor: 'rgba(255,255,255,0.8)'
      },
      plotOptions: {
        area: {
          fillOpacity: 0.5,
          marker: {
            enabled: false
          }
        }
      },
      series: series
    };
  
    this.showChart3D = true;
  }

  getMeasureValue(row: any, grandeurId: number): number | null {
    return row.mesures[grandeurId]?.valeur || null;
  }

  trackByRowIndex(index: number, item: any): number {
    return index;
  }

  trackByGrandeurId(index: number, item: any): number {
    return item.id;
  }
  
}
