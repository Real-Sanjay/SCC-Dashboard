// services/trainer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Trainer } from '../interfaces/trainers.interface';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = 'http://localhost:3000/api/trainers'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  getAllTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.apiUrl);
  }

  getTrainerById(id: string): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/${id}`);
  }
  getTrainerNames(): Observable<string[]> {
    return this.http.get<Trainer[]>(this.apiUrl).pipe(
      map((trainers: any[]) => trainers.map(trainer => trainer.name))
    );
  }

  createTrainer(trainer: Omit<Trainer, '_id'>): Observable<Trainer> {
    return this.http.post<Trainer>(this.apiUrl, trainer);
  }

  updateTrainer(id: string, trainer: Partial<Trainer>): Observable<Trainer> {
    return this.http.put<Trainer>(`${this.apiUrl}/${id}`, trainer);
  }

  deleteTrainer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}