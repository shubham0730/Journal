import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManuscriptService } from '../services/manuscript-details.service';
import { LoaderService } from '../services/loader.service'; 

interface Reviewer {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  selected?: boolean;
}
@Component({
  selector: 'app-reviewer-dialog',
  templateUrl: './reviewer-dialog.component.html',
  styleUrls: ['./reviewer-dialog.component.scss'],
})
export class ReviewerDialogComponent implements OnInit {
  reviewers: any[] = [];
  offsetReviewers = 0;
  limit = 10;
  totalPagesReviewers = 1;
  isLoading = false;
  reviewerColumns = [
    { field: 'username', header: 'User Name' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'email', header: 'Email' }
  ];
  
  reviewerEnableSelection = true;

  constructor(
    public dialogRef: MatDialogRef<ReviewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { manuscriptId: number,manuscriptMaxMod: number; existingReviewers: any[],action:String,refreshReviewers: any },
    private manuscriptService: ManuscriptService,
    public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loadApprovedReviewers();
  }

  loadApprovedReviewers() {
    if(this.data.action === "Add"){
    this.manuscriptService.getApprovedReviewers(this.limit, this.offsetReviewers).subscribe(
      (response: any) => {
        if (!response?.messages?.data?.reviewerDto) {
          console.error("Unexpected response format:", response);
          this.reviewers = [];
          return;
        }

        const allReviewers = response.messages.data.reviewerDto.map((reviewer: any) => ({
          ...reviewer,
          selected: false, // Ensure selection works
        }));

        // Filter out existing reviewers (Fixing incorrect 'has' usage)
        const existingReviewerIds = new Set(this.data.existingReviewers.map(r => r.username));
        this.reviewers = allReviewers.filter((r: Reviewer) => !existingReviewerIds.has(r.username));

        this.totalPagesReviewers = response.messages.pagination.totalPages || 1;
      }

      ,
      (error) => {
        console.error('Error fetching reviewers:', error);
      }
    );}
    if(this.data.action === "Remove"){
      this.reviewers = this.data.existingReviewers;
    }
  }

  onOffsetReviewersChange(newOffset: number) {
    this.offsetReviewers = newOffset;
    this.loadApprovedReviewers();
  }

  onReviewerSelectionChange(selectedReviewers: any[]) {
    this.reviewers.forEach((reviewer) => {
      reviewer.selected = selectedReviewers.some((r) => r.id === reviewer.user);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  assignSelectedReviewers() {
    this.loaderService.show();
    const selectedReviewerIds = this.getSelectedReviewerIds(); // Get selected reviewer IDs
  
    if (selectedReviewerIds.length === 0) {
      console.warn('No reviewers selected');
      this.loaderService.hide();
      return;
    }
  
    this.manuscriptService.assignReviewers(this.data.manuscriptId,selectedReviewerIds,this.data.manuscriptMaxMod).subscribe(
      response => {
        if (response) {
          this.data.refreshReviewers();
        this.closeDialog();        } else {
          console.error('Failed to assign reviewers.');
        }
      },
      error => {
        console.error('Error assigning reviewers:', error);
      },
      () => {
        this.loaderService.hide(); // Stop loading after API call completes
      }
    );
  }
  
  getSelectedReviewerIds(): number[] {
    return this.reviewers.filter(reviewer => reviewer.selected).map(reviewer => reviewer.id);
  }

  
  
}
