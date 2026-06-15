import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

interface UploadedFile {
  id: number;
  fileName: string;
  fileType: string;
  legend: string;
  fileSize: string;
  fileOrder: number;
  fileData?: File; // Store actual file
}

@Injectable({
  providedIn: 'root',
})
export class ManuscriptService {
  private apiUrl = environment.apiUrl;
  private manuscriptData: any = {};
  private authorsData: any[] = [];
  private uploadedFiles: UploadedFile[] = [];
  stage: number = 0;
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
  // Save manuscript data
  saveManuscriptData(data: any) {
    this.manuscriptData = data;
  }

  setAuthorsData(authors: any[]) {
    this.authorsData = authors;
  }

  getAuthorsData() {
    return this.authorsData;
  }
  // Get manuscript data
  getManuscriptData() {
    return this.manuscriptData;
  }
  setStage(stage: number) {
    this.stage = stage;
  }
  getStage() {
    return this.stage;
  }
  setUploadedFiles(files: UploadedFile[]) {
    this.uploadedFiles = files;
  }

  getUploadedFiles(): UploadedFile[] {
    return this.uploadedFiles;
  }

  clearData() {
    this.manuscriptData = null;
    this.authorsData = [];
    this.uploadedFiles = [];
  }

  getManuscripts(limit?: number, offset?: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/sectionalReviewer/getPapers`, {
        params: this.buildHttpParams(limit, offset),
      })
      .pipe(
        map((response) => response?.messages || {}),
        catchError((error) => {
          console.error('Error fetching reviewers:', error);
          return of({
            data: { reviewerDto: [] },
            pagination: { totalPages: 1 },
          });
        })
      );
  }

  getFile(filekey?: any): Observable<any> {
    if (!filekey) {
      console.error('File key is required');
      return of(null); // Return null observable if no file key is provided
    }

    return this.http
      .get<any>(`${this.apiUrl}/reviewer/papers/file/${filekey}`)
      .pipe(
        map((response) => response || {}), // Extract necessary data
        catchError((error) => {
          console.error('Error fetching file:', error);
          return of(null); // Return null instead of unrelated reviewer data
        })
      );
  }

  getFiles(id?: any, manuscriptMod?: any): Observable<any> {
    if (!id || manuscriptMod === undefined || manuscriptMod === null) {
      console.error('Both id and manuscriptMod are required');
      return of(null);
    }

    const url = `${this.apiUrl}/reviewer/papers/${id}/${manuscriptMod}`;
    return this.http.get<any>(url).pipe(
      map((response) => response || {}),
      catchError((error) => {
        console.error('Error fetching file:', error);
        return of(null);
      })
    );
  }

  getFilesAuthor(id?: any, manuscriptMod?: any): Observable<any> {
    if (!id || manuscriptMod === undefined || manuscriptMod === null) {
      console.error('Both id and manuscriptMod are required');
      return of(null);
    }

    const url = `${this.apiUrl}/author/papers/${id}/${manuscriptMod}`;
    return this.http.get<any>(url).pipe(
      map((response) => response || {}),
      catchError((error) => {
        console.error('Error fetching file:', error);
        return of(null);
      })
    );
  }

  getReviewersAssociatedToManuscript(id?: any): Observable<any> {
    if (!id) {
      console.error('Id is required');
      return of(null); // Return null observable if no file key is provided
    }

    return this.http
      .get<any>(`${this.apiUrl}/sectionalReviewer/manuscripts/${id}/reviewers`)
      .pipe(
        map((response) => response || {}), // Extract necessary data
        catchError((error) => {
          console.error('Error fetching reviewers:', error);
          return of(null); // Return null instead of unrelated reviewer data
        })
      );
  }

  assignReviewers(
    manuscriptId: number,
    reviewerIds: number[],
    modNum: number
  ): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiUrl}/sectionalReviewer/manuscripts/${manuscriptId}/reviewers/${modNum}`, // ✅ modNum in path
        {
          addReviewers: reviewerIds,
        }
      )
      .pipe(
        tap((response) =>
          console.log('Reviewers assigned successfully:', response)
        ),
        catchError((error) => {
          console.error('Error assigning reviewers:', error);
          return of(null);
        })
      );
  }

  removeReviewers(
    manuscriptId: number,
    reviewerIds: number[],
    modNum: number
  ): Observable<any> {
    if (!manuscriptId) {
      console.error('❌ Manuscript ID is required');
      return of(null); // Return an empty observable if ID is missing
    }

    return this.http
      .put<any>(
        `${this.apiUrl}/sectionalReviewer/manuscripts/${manuscriptId}/reviewers/${modNum}`,
        { removeReviewers: reviewerIds }
      )
      .pipe(
        tap((response) =>
          console.log('✅ Reviewers removed successfully:', response)
        ), // Log success
        catchError((error) => {
          console.error('❌ Error removing reviewers:', error);
          return of(null); // Prevent observable chain from breaking
        })
      );
  }

  getApprovedReviewers(
    limit: number = 10,
    offset: number = 0
  ): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/sectionalReviewer/getApprovedReviewers`, {
        params: this.buildHttpParams(limit, offset),
      })
      .pipe(
        map((response) => response || {}), // Ensure response is valid
        catchError((error) => {
          console.error('Error fetching approved reviewers:', error);
          return of([]); // Return empty array in case of error
        })
      );
  }
}
