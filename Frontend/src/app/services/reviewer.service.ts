import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap,map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewerService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  private buildHttpParams(limit?: number, offset?: number): HttpParams {
    let httpParams = new HttpParams();

    if (limit !== undefined) {
      httpParams = httpParams.set('limit', limit.toString());
    }

    if (offset !== undefined) {
      httpParams = httpParams.set('offset', offset.toString());
    }

    return httpParams;
  }
  getManuscripts(reviewerAssigned: string, limit: number = 10, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('reviewerAssigned', reviewerAssigned)
      .set('limit', limit.toString())
      .set('offset', offset.toString());
  
    return this.http.get<any>(`${this.apiUrl}/reviewer/manuscripts/`, { params }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching manuscripts:', error);
        return of({ data: { manuscripts: [] }, pagination: { totalPages: 1 } });
      })
    );
  }
  
}