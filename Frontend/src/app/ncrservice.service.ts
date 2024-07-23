import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NCRService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  fetchNcrInit(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/showNCRInit`);
  }

  searchNcr(searchData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/searchNCR`, searchData);
  }
}
