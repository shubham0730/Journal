import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManuscriptService } from '../services/manuscript-details.service';
import { UploadPaperService } from '../services/upload-paper.service';
import { Router } from '@angular/router';

interface UploadedFile {
  id: number;
  fileName: string;
  fileType: string;
  legend: string;
  fileSize: string;
  fileOrder: number;
  fileData?: File; // Store actual file
}

@Component({
  selector: 'app-complete-submit',
  templateUrl: './complete-submit.component.html',
  styleUrls: ['./complete-submit.component.scss'],
})
export class CompleteSubmitComponent implements OnInit {
  submissionForm: FormGroup;
  uploadedFiles: UploadedFile[] = [];

  constructor(
    private fb: FormBuilder,
    private manuscriptService: ManuscriptService,
    private uploadService: UploadPaperService, // Inject UploadPaperService
    private router: Router
  ) {
    this.submissionForm = this.fb.group({
      conflictOfInterest: ['', Validators.required],
      agreementConfirmed: [false, Validators.requiredTrue],
    });
    this.uploadedFiles = this.manuscriptService.getUploadedFiles(); // Retrieve files from service
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if (!this.submissionForm.valid) {
      return; 
    }

    if (!this.uploadedFiles.length) {
      alert('No files to submit.');
      return;
    }


    const filesToSubmit = this.uploadedFiles
      .filter((f) => f.fileData instanceof File) 
      .map((f) => ({
        file: f.fileData as File,
        fileName: f.fileName,
        fileOrder: f.fileOrder,
        fileDesc: f.legend,
        fileType: f.fileType,
      }));


    const fileOrderMap: Record<
      string,
      { fileOrder: number; fileDesc: string; fileType: string }
    > = {};

    filesToSubmit.forEach(({ fileName, fileOrder, fileDesc, fileType }) => {
      fileOrderMap[fileName] = { fileOrder, fileDesc, fileType };
    });


    const fileOrderJson = fileOrderMap;

    const manuscriptMetadata = this.manuscriptService.getManuscriptData() || {};
    const authorMetadata = this.manuscriptService.getAuthorsData() || [];


    const mergedData = {
      manuscript: manuscriptMetadata,
      authors: authorMetadata,
      fileOrder: fileOrderJson,
    };


    const formData = new FormData();
    filesToSubmit.forEach(({ file }) => {
      formData.append('files', file);
    });
    formData.append('metadata', JSON.stringify(mergedData));



    this.uploadService.uploadPapers(formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        alert('Files uploaded successfully!');
        this.manuscriptService.clearData();  
        this.router.navigate(['/my-publications']);  
      },
      error: (error) => {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      },
    });
  }

}
