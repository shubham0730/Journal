import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthorServiceService {
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
  getManuscripts(userId: string, limit: number = 10, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<any>(`${this.apiUrl}/author/getPapers`, { params }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching manuscripts:', error);
        return of({ data: { manuscripts: [] }, pagination: { totalPages: 1 } });
      })
    );
  }

  getAuthors(manuscriptId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/author/getAuthors/${manuscriptId}`).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching authors:', error);
        return of({ data: [], pagination: { totalPages: 1 } });
      })
    );
  }

  getManuscriptDetails(manuscriptId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/author/getManuscriptDetails/${manuscriptId}`).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching manuscript:', error);
        return of({ data: [], pagination: { totalPages: 1 } });
      })
    );
  }

  submitResubmission(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/author/submitResubmission`, formData).pipe(
      catchError(error => {
        console.error('Error submitting resubmission:', error);
        return of({ status: 'error', message: 'Submission failed' });
      })
    );
  }

}
