import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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

  getApprovedEditors(limit?: number, offset?: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/editor/getApprovedEditor`, { params: this.buildHttpParams(limit, offset) }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching approved editors:', error);
        return of({ data: { reviewerDto: [] }, pagination: { totalPages: 1 } });;
      })
    );
  }

  getEditors(limit?: number, offset?: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/editor/getEditor`, { params: this.buildHttpParams(limit, offset) }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching editors:', error);
        return of({ data: { reviewerDto: [] }, pagination: { totalPages: 1 } });;
      })
    );
  }

  getApprovedSectionalReviewers(limit?: number, offset?: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/editor/getApprovedSectionalReviewers`, { params: this.buildHttpParams(limit, offset) }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching approved sectional reviewers:', error);
        return of({ data: { reviewerDto: [] }, pagination: { totalPages: 1 } });;
      })
    );
  }

  getSectionalReviewers(limit?: number, offset?: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/editor/getSectionalReviewers`, { params: this.buildHttpParams(limit, offset) }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching sectional reviewers:', error);
        return of({ data: { reviewerDto: [] }, pagination: { totalPages: 1 } });;
      })
    );
  }

  approveEditor(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editor/approveEditor`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  rejectEditor(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editor/rejectEditor`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  removeEditor(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editor/removeEditor`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  approveSectionalReviewer(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editor/approveSectionalReviewer`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  rejectSectionalReviewer(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editor/rejectSectionalReviewer`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  removeSectionalReviewer(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/editor/removeSectionalReviewer`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateManuscriptStatus(manuscriptId: number, decision: string,decisionComments: string,fileMod: number): Observable<any> {
    const params = new HttpParams()
      .set('manuscriptId', manuscriptId.toString())
      .set('decision', decision)
      .set('decisionComments',decisionComments)
      .set('fileMod',fileMod);
  
    return this.http.post<any>(`${this.apiUrl}/editor/updateManuscriptStatus`, null, { params }).pipe(
      map(response => response || {}),
      catchError(error => {
        console.error('Error updating manuscript status:', error);
        return of(null);
      })
    );
  }
  
}
