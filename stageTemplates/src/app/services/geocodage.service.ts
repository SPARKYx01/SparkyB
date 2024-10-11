// geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  private searchLocation(query: string): Observable<[number, number] | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    return this.http.get<any[]>(url).pipe(
      map(response => {
        if (response && response.length > 0) {
          return [parseFloat(response[0].lat), parseFloat(response[0].lon)] as [number, number];
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  getAgenceLocation(keyword: string, ville: string): Observable<[number, number]> {
    const agenceQuery = `Agence du Bassin Hydraulique du ${keyword}, ${ville}, Morocco`;
    const villeQuery = `${ville}, Morocco`;
    
    return this.searchLocation(agenceQuery).pipe(
      switchMap(result => {
        if (result) return of(result);
        return this.searchLocation(villeQuery);
      }),
      map(result => result || [31.7917, -7.0926] as [number, number]) // Coordonnées par défaut pour le Maroc
    );
  }
}