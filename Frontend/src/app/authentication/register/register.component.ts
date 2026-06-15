import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  postalCode = '';
  role = ''; // Default empty role

  roles = ['EDITOR','SECTIONAL_REVIEWER','REVIEWER', 'AUTHOR']; // Dropdown options

  constructor(private authService: AuthService, private router: Router,public loaderService: LoaderService) {}

  onRegister() {
    this.loaderService.show();
    if (!this.role) {
      alert('Please select a role.');
      this.loaderService.hide();
      return;
    }

    const user = {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      postalCode: this.postalCode,
      role: this.role.toUpperCase() // Ensuring uppercase role
    };

    this.authService.register(user).subscribe(
      (response) => {
        this.loaderService.hide();
        this.router.navigate(['/login']); // Redirect to login upon success
      },
      (error) => {
        this.loaderService.hide();
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    );
  }

  ngOnInit(): void {}
}
