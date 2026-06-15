import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ManuscriptService } from '../services/manuscript-details.service';  

@Component({
  selector: 'app-submit-manuscript-institution-details',
  templateUrl: './submit-manuscript-institution-details.component.html',
  styleUrls: ['./submit-manuscript-institution-details.component.scss']
})
export class SubmitManuscriptInstitutionDetailsComponent implements OnInit {
  authors: any[] = []; // List of authors
  coAuthorForm: FormGroup;
  editingIndex: number | null = null; // Track author being edited
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private manuscriptService: ManuscriptService  
  ) {
    this.coAuthorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      department: ['', Validators.required],
      institution: ['', Validators.required],
      orcid: ['', [Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/)]],
      state: ['', Validators.required],  
      country: ['', Validators.required], 
      isCorresponding: [false]
    });
  }

  ngOnInit(): void {
    // Load existing authors if available
    const savedAuthors = this.manuscriptService.getAuthorsData();
    if (savedAuthors) {
      this.authors = savedAuthors;
    }
  }

  // Open modal for Add/Edit
  openModal(isEdit = false, index: number | null = null) {
    this.showModal = true;
    this.editingIndex = index;
    
    if (isEdit && index !== null) {
      const author = this.authors[index];
      this.coAuthorForm.setValue({
        title: author.title,
        firstName: author.firstName,
        middleName: author.middleName,
        lastName: author.lastName,
        email: author.email,
        department: author.department,
        institution: author.institution,
        state: author.state,
        country: author.country,
        orcid: author.orcid,
        isCorresponding: author.isCorresponding
      });
    } else {
      this.resetForm();
    }
  }

  // Edit an existing author
  editAuthor(index: number) {
    this.openModal(true, index);
  }

  // Save or update author
  saveCoAuthor() {
    if (this.coAuthorForm.valid) {
      const authorData = { ...this.coAuthorForm.value };
      authorData.isCorresponding = !!authorData.isCorresponding; // Ensure boolean

      if (this.editingIndex !== null) {
        this.authors[this.editingIndex] = authorData; // Update author
      } else {
        this.authors.push(authorData); // Add new author
      }

      this.closeModal();
    } else {
      alert('Please fill all required fields correctly!');
    }
  }

  // Close modal and reset form
  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  // Reset form values
  resetForm() {
    this.coAuthorForm.reset({
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      department: '',
      institution: '',
      state: '',
      country: '',
      orcid: '',
      isCorresponding: false
    });
    this.editingIndex = null;
  }

  // Delete an author
  deleteAuthor(index: number) {
    if (confirm(`Are you sure you want to delete ${this.authors[index].firstName}?`)) {
      this.authors.splice(index, 1);
    }
  }

  // Drag-and-drop reordering
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.authors, event.previousIndex, event.currentIndex);
  }

  // Save and navigate
  saveDetails() {
    this.manuscriptService.setAuthorsData(this.authors);
    this.router.navigate(['submit-manuscript/upload']);
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/submit-manuscript/details']);
  }
}
