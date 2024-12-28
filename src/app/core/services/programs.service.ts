import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Program } from '../interfaces/programs.interface';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {

  private baseUrl = 'http://localhost:3000/api/programs'; // Update with your API URL

  constructor(private http: HttpClient) {}

  // Fetch all programs
  getPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(this.baseUrl);
  }

  // Add a new program
  addProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(this.baseUrl, program);
    console.log("Going data", program);
  }


  // Update an existing program
  updateProgram(id: string, program: Program): Observable<Program> {
    return this.http.put<Program>(`${this.baseUrl}/${id}`, program);
  }

  // Delete a program
  deleteProgram(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getGroupedTrainers(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/trainerGroup`);
  }

}