import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectionalReviewerService {
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

  getApprovedReviewers(limit?: number, offset?: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sectionalReviewer/getApprovedReviewers`, { params: this.buildHttpParams(limit, offset) }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching approved reviewers:', error);
        return of({ data: { reviewerDto: [] }, pagination: { totalPages: 1 } });;
      })
    );
  }

  getReviewers(limit?: number, offset?: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sectionalReviewer/getReviewers`, { params: this.buildHttpParams(limit, offset) }).pipe(
      map(response => response?.messages || {}),
      catchError(error => {
        console.error('Error fetching reviewers:', error);
        return of({ data: { reviewerDto: [] }, pagination: { totalPages: 1 } });;
      })
    );
  }

  approveReviewer(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sectionalReviewer/approveReviewer`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  rejectReviewer(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sectionalReviewer/rejectReviewer`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  removeReviewer(reviewerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sectionalReviewer/removeReviewer`, reviewerData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  sendForApproval(id: number, fileMod: number): Observable<any> {
    const url = `${this.apiUrl}/sectionalReviewer/manuscripts/${id}/${fileMod}/submit`;
    return this.http.put<any>(url, null, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
