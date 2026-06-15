import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UploadPaperService } from '../services/upload-paper.service';
import { ManuscriptService } from '../services/manuscript-details.service';

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
  selector: 'app-upload-manuscript',
  templateUrl: './upload-manuscript.component.html',
  styleUrls: ['./upload-manuscript.component.scss'],
})
export class UploadManuscriptComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  uploadedFiles: UploadedFile[] = [];
  fileDetails: any[] = [];
  constructor(
    private router: Router,
    private uploadService: UploadPaperService,
    private manuscriptService: ManuscriptService
  ) {}

  ngOnInit() {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (!file.name.match(/\.(doc|docx|jpg|png)$/)) {
        alert('Please upload only allowed documents (.doc, .docx) or images (.jpg, .png)');
        return;
    }

    const newFile: UploadedFile = {
        id: this.uploadedFiles.length + 1,
        fileName: file.name,
        fileType: '',
        legend: '',
        fileSize: this.formatFileSize(file.size),
        fileOrder: this.uploadedFiles.length + 1,
        fileData: file,
    };

    this.uploadedFiles.push(newFile);
}


  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / 1048576).toFixed(1) + 'MB';
  }

  previewFile(file: UploadedFile) {
    console.log('Preview file:', file);
  }

  deleteFile(file: UploadedFile) {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f.id !== file.id);
  }

  saveAndContinue() {
    if (!this.uploadedFiles.length) {
      alert('Please upload at least one file before proceeding.');
      return;
    }

    this.manuscriptService.setUploadedFiles(this.uploadedFiles); // Store files in service

    this.router.navigate(['/submit-manuscript/complete-submission']); // Route to stage 4
  }
  

  returnHome() {
    this.router.navigate(['submit-manuscript/institutional-details']);
  }
}
