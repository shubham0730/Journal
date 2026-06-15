import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service'; 

@Component({
  selector: 'app-session-timeout-dialog',
  templateUrl: './session-timeout-dialog.component.html',
  styleUrls: ['./session-timeout-dialog.component.scss']
})
export class SessionTimeoutDialogComponent implements OnInit {
  countdown = 10; // Countdown in seconds
  timerInterval: any;

  constructor(
    public dialogRef: MatDialogRef<SessionTimeoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService, 
    private router: Router,
    public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.openDialog();
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.loaderService.closeDialog();
        this.logout();
      }
    }, 1000);
  }

  stayConnected() {
    clearInterval(this.timerInterval);
    this.loaderService.closeDialog();
    this.dialogRef.close('stayConnected');
  }

  logout() {
    this.authService.logout().subscribe(() => {
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole'); 
      this.router.navigate(['/login']);
      this.dialogRef.close('logout');
    });
  }

    
}
