import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionTimeoutDialogComponent } from '../session-timeout-dialog/session-timeout-dialog.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem('access_token');

    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
  
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (!refreshToken) {
        this.authService.logout(); // If no refresh token, force logout
        return throwError(() => new Error('Session expired. Please log in again.'));
      }
  
      // ✅ Open the session timeout dialog
      const dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
        width: '400px',
        disableClose: true, // Prevent closing without user action
      });
  
      return dialogRef.afterClosed().pipe(
        switchMap((result) => {
          if (result === 'stayConnected') {
            // ✅ User clicked "Stay Connected", proceed with token refresh
            return this.authService.refreshToken().pipe(
              switchMap((newTokens: any) => {
                this.isRefreshing = false;
                sessionStorage.setItem('access_token', newTokens.messages.data.access_token);
                sessionStorage.setItem('refresh_token', newTokens.messages.data.refresh_token);
  
                return next.handle(req.clone({
                  setHeaders: { Authorization: `Bearer ${newTokens.messages.data.access_token}` }
                }));
              }),
              catchError(() => {
                this.isRefreshing = false;
                this.authService.logout(); // Logout if refresh fails
                return throwError(() => new Error('Session expired. Please log in again.'));
              })
            );
          } else {
            // ✅ User clicked "Log Out" or closed dialog
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => new Error('Session expired. Please log in again.'));
          }
        })
      );
    }
  
    return throwError(() => new Error('Session expired. Please log in again.'));
  }
  
}
