import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dummy-submit',
  templateUrl: './dummy-submit.component.html',
  styleUrls: ['./dummy-submit.component.scss']
})
export class DummySubmitComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      
        console.log("File uploaded successfully");
 
  }
  }

}
