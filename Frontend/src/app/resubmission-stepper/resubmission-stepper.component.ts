import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AuthorServiceService } from '../services/author-service.service';
import { LoaderService } from '../services/loader.service';
interface Author {
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  department?: string;
  institution: string;
  state?: string;
  country?: string;
  orcid?: string;
  isCorrespondingAuthor?: boolean;
}

interface UploadedFile {
  id: number;
  fileName: string;
  fileType: string;
  legend: string;
  fileSize: string;
  fileOrder: number;
  fileData?: File;
}


@Component({
  selector: 'app-resubmission-stepper',
  templateUrl: './resubmission-stepper.component.html',
  styleUrls: ['./resubmission-stepper.component.scss']
})


export class ResubmissionStepperComponent implements OnInit {
  @Input() manuscriptId!: number | null;
  @Input() modNo!: number | null;

  // ---------- STEP 1 ----------
  articleForm!: FormGroup;
  articleTypes = ['Research Article', 'Review', 'Case Study', 'Short Communication'];

  // ---------- STEP 2 ----------
  authorsForm!: FormGroup;

  // ---------- STEP 3 ----------
  uploadedFiles: UploadedFile[] = [];

  constructor(private fb: FormBuilder, private authorService: AuthorServiceService, public loaderService: LoaderService,) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['manuscriptId'] && changes['manuscriptId'].currentValue !== null) {

      console.log('📌 manuscriptId updated:', this.manuscriptId);
      this.fetchAuthors(String(this.manuscriptId));
      this.fetchManuscriptDetails(String(this.manuscriptId));

      // 👉 You can trigger API calls here if needed
    }

    if (changes['modNo'] && changes['modNo'].currentValue !== null) {
      console.log('📌 modNo updated:', this.modNo);
      // 👉 Use modNo for version-specific logic
    }
  }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      id:[null],
      articleType: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      abstractText: ['', Validators.maxLength(5000)],
      wordCount: [null],
      bwFigures: [null],
      colorFigures: [null],
      tables: [null],
      keywords: ['', [Validators.required, Validators.pattern(/^([^,]+,){2,}[^,]+$/)]],
      trialRegistration: ['']
    });

    this.authorsForm = this.fb.group({
      authors: this.fb.array([]) // populated dynamically
    });

  }

  get authorsArray(): FormArray {
    return this.authorsForm.get('authors') as FormArray;
  }

  getAuthorGroup(index: number): AbstractControl {
    return this.authorsArray.at(index);
  }

  // ---------- File Handling ----------
  // ---------- File Handling ----------
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.handleFile(input.files[0]);
  }

  handleFile(file: File): void {
    if (!file.name.match(/\.(doc|docx|jpg|png)$/)) {
      alert('Please upload only allowed documents (.doc, .docx) or images (.jpg, .png)');
      return;
    }

    const newFile: UploadedFile = {
      id: this.uploadedFiles.length + 1,
      fileName: file.name,
      fileType: '', // let user select in table
      legend: '',
      fileSize: this.formatFileSize(file.size),
      fileOrder: this.uploadedFiles.length + 1,
      fileData: file
    };

    this.uploadedFiles.push(newFile);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / 1048576).toFixed(1) + 'MB';
  }

  previewFile(file: UploadedFile): void {
    console.log('Preview file:', file);
    alert(`Previewing: ${file.fileName}`);
  }

  deleteFile(file: UploadedFile): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f.id !== file.id);
  }


  // ---------- Final Submission ----------

  onCorrespondingAuthorChange(selectedIndex: number): void {
    this.authorsArray.controls.forEach((group, index) => {
      const control = group.get('isCorrespondingAuthor');
      if (control && index !== selectedIndex) {
        control.setValue(false, { emitEvent: false });
      }
    });
  }

  fetchAuthors(manuscriptId: string): void {
    this.loaderService.show(); // Start loading
    this.authorService.getAuthors(manuscriptId).subscribe(
      (response) => {
        const authors: Author[] = response.data || [];

        const authorGroups = authors.map(author =>
          this.fb.group({
            title: [author.title, Validators.required],
            firstName: [author.firstName, Validators.required],
            middleName: [author.middleName || ''],
            lastName: [author.lastName, Validators.required],
            email: [author.email, [Validators.required, Validators.email]],
            department: [author.department || ''],
            institution: [author.institution, Validators.required],
            state: [author.state || ''],
            country: [author.country || ''],
            orcid: [author.orcid || ''],
            isCorrespondingAuthor: [author.isCorrespondingAuthor || false]
          })
        );

        this.authorsForm.setControl('authors', this.fb.array(authorGroups));
        this.loaderService.hide(); // Stop loading
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  fetchManuscriptDetails(manuscriptId: string): void {
    this.loaderService.show(); // Start loading

    this.authorService.getManuscriptDetails(manuscriptId).subscribe(
      (response) => {
        const manuscript = response.data;

        if (!manuscript) {
          console.warn('No manuscript data received');
          this.loaderService.hide();
          return;
        }

        this.articleForm.patchValue({
          id:manuscript.id || null,
          articleType: manuscript.articleType || '',
          title: manuscript.title || '',
          abstract: manuscript.abstractText || '',
          wordCount: manuscript.wordCount || null,
          bwFigures: manuscript.bwFigures || null,
          colorFigures: manuscript.colorFigures || null,
          tables: manuscript.tables || null,
          keywords: manuscript.keywords || '',
          trialRegistration: manuscript.trialRegistration?.toString() || ''
        });

        this.loaderService.hide(); // Stop loading
      },
      (error) => {
        console.error('Error fetching manuscript details:', error);
        this.loaderService.hide();
      }
    );
  }

finalResubmit(): void {
  if (this.articleForm.invalid) {
    alert('Please complete required fields in Step 1.');
    return;
  }

  if (this.authorsArray.length === 0 || this.authorsForm.invalid) {
    alert('Please complete author details in Step 2.');
    return;
  }

  const mainFile = this.uploadedFiles.find(f => f.fileType === 'Main Article' && f.fileData);
  if (!mainFile) {
    alert('A "Main Article" file must be uploaded.');
    return;
  }

  const formData = new FormData();

  // Attach files + metadata map (same as onSubmit)
  const fileMetadataMap: Record<string, { fileOrder: number; fileDesc: string; fileType: string }> = {};
  this.uploadedFiles.forEach(file => {
    if (file.fileData) {
      formData.append('files', file.fileData, file.fileName);
      fileMetadataMap[file.fileName] = {
        fileOrder: file.fileOrder,
        fileDesc: file.legend || '',
        fileType: file.fileType
      };
    }
  });

  // Map authors to match backend property names
const authorsForSubmission = this.authorsArray.value.map((a: Author) => ({    title: a.title,
    firstName: a.firstName,
    middleName: a.middleName,
    lastName: a.lastName,
    email: a.email,
    department: a.department,
    institution: a.institution,
    state: a.state,
    country: a.country,
    orcid: a.orcid,
    corresponding: a.isCorrespondingAuthor // <-- renamed to match entity
  }));

  // Map manuscript to remove unsupported fields
  const manuscriptForSubmission = { ...this.articleForm.value };
  delete (manuscriptForSubmission as any).resubmissionNotes; // remove if exists

  // Prepare metadata
  const metadata = {
    manuscript: manuscriptForSubmission,
    authors: authorsForSubmission,
    fileOrder: fileMetadataMap
  };

  formData.append('metadata', JSON.stringify(metadata));

  // manuscriptId stays as extra field for resubmission
  if (this.manuscriptId !== null) {
    formData.append('manuscriptId', this.manuscriptId.toString());
  }

  this.loaderService.show();
  this.authorService.submitResubmission(formData).subscribe(
    (response) => {
      this.loaderService.hide();
      alert(response?.message || 'Resubmission submitted successfully!');
    },
    (error) => {
      this.loaderService.hide();
      console.error('Resubmission error:', error);
      alert('Submission failed. Please try again.');
    }
  );
}





}