import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  private apiUrl = 'http://localhost:3000/scores';

  constructor(private http: HttpClient) {}

  getScoreCard(): Observable<any> {
    // console.log('loaded');
    return this.http.get(this.apiUrl);
  }

  getScoreCardById(id: string): Observable<any> {
    // return this.http.get<any>(`${this.apiUrl}${id}`); 
    console.log(this.apiUrl+id)
    return this.http.get<any>(this.apiUrl+id); 
  }

  createScoreCard(scorecard: any): Observable<any> {
    return this.http.post(this.apiUrl, scorecard);
  }

  updateScoreCard(id: string,scorecard:any ): Observable<void>{
    return this.http.put<void>(this.apiUrl+id,scorecard); 
  }

  deleteScoreCard(id: string): Observable<void> {
    console.log(id);
    this.apiUrl=`${this.apiUrl}${id}`;
    console.log(this.apiUrl);
    return this.http.delete<void>(this.apiUrl);
  }
}