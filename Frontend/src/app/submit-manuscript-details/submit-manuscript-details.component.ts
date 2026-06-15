import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManuscriptService } from '../services/manuscript-details.service';  

@Component({
  selector: 'app-submit-manuscript-details',
  templateUrl: './submit-manuscript-details.component.html',
  styleUrls: ['./submit-manuscript-details.component.scss']
})
export class SubmitManuscriptDetailsComponent implements OnInit {
  articleForm: FormGroup;
  articleTypes = ['Research Article', 'Review Article', 'Case Report'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private manuscriptService: ManuscriptService  
  ) {
    this.articleForm = this.fb.group({
      articleType: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      runningTitle: ['', Validators.maxLength(500)],
      abstractText: ['', Validators.maxLength(3500)],
      wordCount: [''],
      bwFigures: [''],
      colorFigures: [''],
      tables: [''],
      pages: [''],
      keywords: ['', Validators.required],
      trialRegistration: ['']
    });
  }

  ngOnInit(): void {
    // Load existing data if available
    const savedData = this.manuscriptService.getManuscriptData();
    if (savedData) {
      this.articleForm.patchValue(savedData);
    }
  }
  
  onSubmit() {
    if (this.articleForm.valid) {
      const username = sessionStorage.getItem("username");
      if (!username) {
        alert("Username not found in session. Please log in again.");
        return;
      }
      const formData = { ...this.articleForm.value, username };

      // Save data to service
      this.manuscriptService.saveManuscriptData(formData);

      // Navigate to the next step
      this.router.navigate(['/submit-manuscript/institutional-details']);
    } else {
      alert('Please fill all required fields.');
    }
  }
}
