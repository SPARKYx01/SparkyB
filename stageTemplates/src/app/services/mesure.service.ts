import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Mesure } from '../models/mesure';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MesureService {
  private baseUrl = 'https://localhost:7109/api/APIMesures';
  private mesuresSubject = new BehaviorSubject<Mesure[]>([]);
  public mesures$ = this.mesuresSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAllMesures().subscribe(mesures => {
      this.mesuresSubject.next(mesures);
    });
  }

  getAllMesures(): Observable<Mesure[]> {
    return this.http.get<Mesure[]>(`${this.baseUrl}`).pipe(
      tap(mesures => this.mesuresSubject.next(mesures))
    );
  }

  getMesureById(id: number): Observable<Mesure> {
    return this.http.get<Mesure>(`${this.baseUrl}/${id}`);
  }

  createMesure(mesure: Mesure): Observable<Mesure> {
    return this.http.post<Mesure>(`${this.baseUrl}`, mesure).pipe(
      tap(newMesure => {
        const currentMesures = this.mesuresSubject.getValue();
        this.mesuresSubject.next([...currentMesures, newMesure]);
      })
    );
  }

  updateMesure(mesure: Mesure): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${mesure.id}`, mesure).pipe(
      tap(() => {
        const currentMesures = this.mesuresSubject.getValue();
        const updatedMesures = currentMesures.map(m => m.id === mesure.id ? mesure : m);
        this.mesuresSubject.next(updatedMesures);
      })
    );
  }

  deleteMesure(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const currentMesures = this.mesuresSubject.getValue();
        const updatedMesures = currentMesures.filter(m => m.id !== id);
        this.mesuresSubject.next(updatedMesures);
      })
    );
  }
}
