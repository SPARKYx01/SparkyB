import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Journal {
  date: Date;
  action: string;
  utilisateur: string;
  barrage: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'https://localhost:7109/api/logs'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  enregistrerJournal(journal: Journal): Observable<Journal> {
    return this.http.post<Journal>(this.apiUrl, journal);
  }

  obtenirJournaux(): Observable<Journal[]> {
    return this.http.get<Journal[]>(this.apiUrl);
  }
}