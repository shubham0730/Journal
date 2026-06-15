import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadPaperService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  uploadPapers(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/papers/upload`, formData);
  }

  uploadReviews(
    files: File[],
    action: string,
    manuscriptId: number,
    fileMod: number,
    uploadedBy: string
  ): Observable<any> {
    const formData = new FormData();

    // Append each file to FormData
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Append other fields as strings
    formData.append('action', action);
    formData.append('manuscriptId', manuscriptId.toString()); // Convert number to string
    formData.append('fileMod', fileMod.toString());
    formData.append('uploadedBy', uploadedBy);

    return this.http.post<any>(`${this.apiUrl}/reviewer/updateReview`, formData);
  }

  generateReviews(manuscriptId?: string, fileType?: string): Observable<any> {
    let params = new HttpParams();

    if (manuscriptId) {
      params = params.set('manuscriptId', manuscriptId);
    }
    if (fileType) {
      params = params.set('fileType', fileType);
    }

    return this.http.get(`${this.apiUrl}/reviewer/generate`, { params }).pipe(
      map((response) => response || {}), // Ensure response is valid
      catchError((error) => {
        console.error('Error generating reviews:', error);
        return throwError(() => new Error('Failed to generate reviews'));
      })
    );
  }
}
