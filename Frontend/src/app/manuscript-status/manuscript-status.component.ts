import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ManuscriptService } from '../services/manuscript-details.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ReviewerDialogComponent } from '../reviewer-dialog/reviewer-dialog.component';
import { LoaderService } from '../services/loader.service';
import { UploadPaperService } from '../services/upload-paper.service';
import { DecisionModalComponent } from '../decision-modal/decision-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditorService } from '../services/editor.service';
import { SectionalReviewerService } from '../services/sectional-reviewer.service';
@Component({
  selector: 'app-manuscript-status',
  templateUrl: './manuscript-status.component.html',
  styleUrls: ['./manuscript-status.component.scss'],
})
export class ManuscriptStatusComponent implements OnInit {
  activeTab: number = 0;
  allTabs = [
    'Manuscript Details',
    'Manuscript Files',
    'Reviewers',
    'View Reviews',
    'Manuscript Decision',
    'Resubmit'
  ];
  tabsToShow: string[] = [];
  isLoading: boolean = false;
  manuscriptDetails: any[] = [];
  manuscriptId: number | null = null;
  fileMod: number | null = null;
  manuscriptFiles: any[] = [];
  reviewers$ = new BehaviorSubject<any[]>([]);
  reviewers: any[] = []; // ✅ Fixed missing property
  fileUrl: SafeResourceUrl | null = null;
  highlightedTexts: any[] = [];
  offsetReviewers = 0;
  limit = 10;
  totalPagesReviewers = 1;
  action = '';
  selectedFiles: File[] = [];
  uploadAction: string = 'update';
  manuscriptMaxMod: number | null = null;
  userRole: string = '';
  isManuscriptLocked: boolean = false;
  isModLocked: boolean = false;

  @ViewChild('docContainer', { static: false }) docContainer!: ElementRef;

  detailsColumns = [
    { header: 'Title', field: 'title' },
    { header: 'Article Type', field: 'articleType' },
    { header: 'Status', field: 'status' },
  ];

  fileColumns = [
    { header: 'File Name', field: 'fileName' },
    {
      header: 'Actions',
      field: 'actions',
      type: 'action',
      actions: [
        { label: 'View', action: (row: any) => this.viewFile(row) },
        { label: 'Download', action: (row: any) => this.downloadFile(row) },
      ],
    },
  ];

  reviewerColumns = [
    { header: 'Reviewer Name', field: 'username' },
    { header: 'Email', field: 'email' },
    { header: 'First Name', field: 'firstName' },
    { header: 'Last Name', field: 'lastName' },
  ];

  constructor(
    private manuscriptService: ManuscriptService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    public loaderService: LoaderService,
    private uploadService: UploadPaperService,
    private snackBar: MatSnackBar,
    private editorService: EditorService,
    private sectionReviewerService: SectionalReviewerService
  ) { }

  ngOnInit() {
    this.userRole = sessionStorage.getItem('userRole') || '';

    this.tabsToShow = this.allTabs.filter((tab) => {
      if (this.userRole === 'EDITOR') {
        return [
          'Manuscript Details',
          'Manuscript Files',
          'Reviewers',
          'View Reviews',
          'Manuscript Decision'
        ].includes(tab);
      }

      if (this.userRole === 'SECTIONAL_REVIEWER') {
        return ['Manuscript Details', 'Manuscript Files', 'Reviewers', 'View Reviews'].includes(tab);
      }

      if (this.userRole === 'REVIEWER') {
        return ['Manuscript Details', 'Manuscript Files', 'View Reviews'].includes(tab);
      }

      if (this.userRole === 'AUTHOR') {
        return ['Manuscript Details', 'Manuscript Files', 'Resubmit'].includes(tab);
      }

      return false; // fallback for unknown roles
    });

    this.loadManuscriptData();
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    const tabName = this.tabsToShow[index];

    switch (tabName) {
      case 'Manuscript Files':
        this.fetchFiles();
        break;

      case 'Reviewers':
        this.fetchManuscriptReviewers();
        break;

      // Add more cases if needed
    }
  }

  onAdd() {
    this.action = 'Add';
    this.openReviewerDialog();
  }

  goBack(): void {
    const data = history.state;
    const returnUrl = data.returnUrl || '/manuscript-dashboard';
    this.router.navigateByUrl(returnUrl);
  }

  loadManuscriptData() {
    const data = history.state;
    if (data) {
      this.manuscriptId = data.id;
      this.fileMod = data.version;
      this.manuscriptMaxMod = data.version
        ? data.version
        : Math.max(...data.fileMods);
      this.isManuscriptLocked = data.isLocked === 'Y';
      this.isModLocked = data.fileMods?.[data.version] === 'Y';
      this.manuscriptDetails = [
        {
          id: data.id,
          title: data.title,
          articleType: data.articleType,
          status: data.status,
        },
      ];

      this.manuscriptFiles = data.manuscriptFiles || [];
      this.reviewers = data.reviewers || [];

      this.totalPagesReviewers = Math.ceil(this.reviewers.length / 10);
    }
  }

  onOffsetReviewersChange(newOffset: number) {
    this.offsetReviewers = newOffset;
  }

  fetchFiles(): void {
    this.loaderService.show(); // Start loading
    const id = this.manuscriptId;

    const fetchObservable = this.userRole === 'AUTHOR'
      ? this.manuscriptService.getFilesAuthor(id, this.manuscriptMaxMod)
      : this.manuscriptService.getFiles(id, this.manuscriptMaxMod);

    fetchObservable.subscribe(
      (response) => {
        this.manuscriptFiles = response.messages?.data || [];
        this.loaderService.hide(); // Stop loading
      },
      (error) => {
        console.error('Error fetching files:', error);
        this.loaderService.hide(); // Stop loading on error
      }
    );
  }

  async downloadFile(row: any) {
    this.loaderService.show();
    try {
      const response = await this.manuscriptService
        .getFile(row.fileKey)
        .toPromise();

      if (response?.messages?.data) {
        const fileUrl = response.messages.data;
        this.triggerDownload(fileUrl);
      } else {
        console.error('File URL not found in response');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  triggerDownload(fileUrl: string) {
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.target = '_blank';
    anchor.download = fileUrl.split('/').pop() || 'downloaded-file';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  async viewFile(row: any) {
    this.loaderService.show();
    try {
      const response = await this.manuscriptService
        .getFile(row.fileKey)
        .toPromise();

      if (response?.messages?.data) {
        const s3Url = response.messages.data;
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
          s3Url
        )}&embedded=true`;

        this.fileUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl); // ✅ Properly sanitized
      } else {
        console.error('File URL not found in response');
      }
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  removeReviewers() {
    if (!this.manuscriptId) {
      console.error('❌ Manuscript ID is missing!');
      return;
    }
    if (!this.manuscriptMaxMod) {
      console.error('❌ File Mod ID is missing!');
      return;
    }

    const selectedReviewerIds = this.getSelectedReviewerIds();

    if (selectedReviewerIds.length === 0) {
      console.warn('⚠️ No reviewers selected for removal');
      return;
    }

    this.loaderService.show();

    this.manuscriptService
      .removeReviewers(this.manuscriptId, selectedReviewerIds, this.manuscriptMaxMod)
      .subscribe(
        (response) => {
          if (response) {
            console.log('✅ Reviewers successfully removed.');
            this.fetchManuscriptReviewers();
          } else {
            console.error('❌ Failed to remove reviewers.');
          }
        },
        (error) => {
          console.error('❌ API error:', error);
        },
        () => {
          this.loaderService.hide();
        }
      );
  }

  fetchManuscriptReviewers() {
    this.loaderService.show();
    if (!this.manuscriptId) {
      console.error('❌ Manuscript ID is missing!');
      return;
    }

    this.manuscriptService
      .getReviewersAssociatedToManuscript(this.manuscriptId)
      .subscribe(
        (response) => {
          if (response?.messages?.data) {
            this.reviewers = response.messages.data;
            this.reviewers$.next(this.reviewers); // ✅ Properly updating the subject
          } else {
            this.reviewers = [];
            this.reviewers$.next([]);
          }
          this.loaderService.hide();
        },
        (error) => {
          console.error('❌ Error fetching reviewers:', error);
          this.loaderService.hide();
        }
      );
  }

  openReviewerDialog() {
    if (!this.manuscriptId) {
      console.error('Manuscript ID is missing!');
      return;
    }

    const dialogRef = this.dialog.open(ReviewerDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {
        manuscriptId: this.manuscriptId,
        manuscriptMaxMod: this.manuscriptMaxMod, // ✅ pass it here
        existingReviewers: this.reviewers,
        refreshReviewers: () => this.fetchManuscriptReviewers(),
        action: this.action,
      },
    });

    dialogRef.afterClosed().subscribe((selectedReviewers: any[]) => {
      if (selectedReviewers?.length) {
        this.fetchManuscriptReviewers();
      }
    });
  }

  hasSelectedReviewers() {
    return this.reviewers.some((r) => r.selected);
  }

  getSelectedReviewerIds(): number[] {
    return this.reviewers.filter((r) => r.selected).map((r) => r.id);
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  // Upload files
  uploadPapers() {
    if (
      this.selectedFiles.length === 0 ||
      !this.uploadAction ||
      !this.manuscriptId ||
      !this.manuscriptMaxMod
    ) {
      alert('Please fill all fields and select files.');
      return;
    }

    this.uploadService
      .uploadReviews(
        this.selectedFiles,
        this.uploadAction,
        this.manuscriptId,
        this.manuscriptMaxMod,
        sessionStorage.getItem('username') || ''
      )
      .subscribe(
        (response) => alert('Files uploaded successfully!'),
        (error) => alert('Error uploading files!')
      );
  }

  generateReview() {
    this.uploadService
      .generateReviews(
        this.manuscriptId ? this.manuscriptId.toString() : '',
        'Review'
      )
      .subscribe({
        next: (response) => {
          if (response?.messages?.data) {
            const s3Url = response.messages.data;
            const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
              s3Url
            )}&embedded=true`;

            // Sanitize and assign to iframe
            this.fileUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
          } else {
            console.error('No file URL received');
          }
        },
        error: (error) => console.error('Error:', error),
      });
  }
  openDecisionModal(decision: string) {
    const dialogRef = this.dialog.open(DecisionModalComponent, {
      width: '400px',
      data: { decision },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed) {
        const comments = result.comments;

        // 🚀 Call the API here
        this.editorService
          .updateManuscriptStatus(this.manuscriptId || -1, decision, comments, this.manuscriptMaxMod || -1)
          .subscribe(
            (response) => {
              console.log('Manuscript status updated:', response);

              this.snackBar.open(`${decision} decision submitted`, 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              });
            },
            (error) => {
              console.error('Error updating manuscript status:', error);

              this.snackBar.open('Failed to submit decision', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['snackbar-error'],
              });
            }
          );
      } else {
        this.snackBar.open('Action cancelled', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-info'],
        });
      }
    });
  }

  sendForApproval(): void {
    if (this.manuscriptId != null && this.manuscriptMaxMod != null) {
      this.sectionReviewerService.sendForApproval(this.manuscriptId, this.manuscriptMaxMod).subscribe({
        next: () => {
          this.snackBar.open('✅ Sent for Approval', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          const errorMsg = err?.error?.message || '❌ Failed to send for approval';
          this.snackBar.open(errorMsg, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.snackBar.open('❌ Missing manuscript or fileMod ID', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
    }
  }

}
