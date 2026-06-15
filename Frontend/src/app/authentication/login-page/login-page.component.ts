import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoaderService } from '../../services/loader.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginComponent implements OnInit {
  userEmail = '';
  password = '';

  constructor(private authService: AuthService, private router: Router,public loaderService: LoaderService) {}

  ngOnInit(): void {}

  async login(): Promise<void> {
    this.loaderService.show();
    const credentials = { userEmail: this.userEmail, password: this.password };
  
    try {
      const response = await lastValueFrom(this.authService.login(credentials)); // Convert Observable to Promise
  
      const success = this.authService.storeTokens(
        response.messages.codes[0].Desc.access_token,
        response.messages.codes[0].Desc.refresh_token,
        true,
        credentials.userEmail,
        response.messages.codes[0].Desc.userName,
        response.messages.codes[0].Desc.role
      );
  
      if (success) {
        this.loaderService.hide();
        await this.router.navigate(['/']); // Ensure navigation happens after storing tokens
      }
    } catch (error) {
      this.loaderService.hide();
      console.error('Login failed:', error);
      
      alert('Invalid email or password');
    }
  } 
}
