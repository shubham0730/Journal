import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, of, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081'; 
  private loggedIn = new BehaviorSubject<boolean>(this.getStoredLoginState());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  // Register User
  register(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/auth/register`, user, { headers }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Login User
  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        const success = this.storeTokens(
          response.messages.codes[0].Desc.access_token,
          response.messages.codes[0].Desc.refresh_token,
          true,
          credentials.userEmail,
          response.messages.codes[0].Desc.userName,
          response.messages.codes[0].Desc.role
        );
  
        if (success) {
          this.loggedIn.next(true); // Now update the state only after tokens are stored
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  logout(): Observable<any> {
    const token = sessionStorage.getItem('access_token');

    if (!token) {
      alert("Please login.");
      return of(null);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers, withCredentials: true }).pipe(
      tap(() => {
        this.clearSession();
      }),
      catchError((error) => this.handleError(error))
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {}, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  

  // Store user data and tokens
  storeTokens(accessToken: string, refreshToken: string, isLoggedIn: boolean, userEmail: string, username: string,role: string) {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    sessionStorage.setItem('userEmail', userEmail);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userRole', role);
    return true;
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  }

  private clearSession() {
    sessionStorage.clear();
    this.loggedIn.next(false);
  }

  private getStoredLoginState(): boolean {
    return JSON.parse(sessionStorage.getItem('isLoggedIn') || 'false');
  }

  private handleError(error: any) {
    console.error("AuthService Error:", error);
    return throwError(() => error);
  }
}
