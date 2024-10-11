import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private apiUrl = 'https://localhost:7109/api/statistiques'; // Change l'URL si nécessaire

  constructor(private http: HttpClient) { }

  getNombreUtilisateurs(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/utilisateurs`);
  }

  getNombreSites(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sites`);
  }

  getNombreBarrages(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/barrages`);
  }
}
