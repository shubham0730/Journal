import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = {
    firstName: 'Shubham',
    lastName: 'Shinde',
    email: 'shubhamss@gmail.com',
    role: 'Software Engineer',
    avatar: 'https://via.placeholder.com/100'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
