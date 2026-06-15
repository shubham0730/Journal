import { Component, OnInit } from '@angular/core';
import {SectionalReviewerService } from '../services/sectional-reviewer.service'
import { LoaderService } from '../services/loader.service'; 

@Component({
  selector: 'app-reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrls: ['./reviewer-dashboard.component.scss']
})
export class ReviewerDashboardComponent implements OnInit {
  isLoading: boolean = false; // Loader state
  
    viewColumns = [
      { header: 'ID', field: 'id' },
      { header: 'Email', field: 'email' },
      { header: 'First Name', field: 'firstName' },
      { header: 'Last Name', field: 'lastName' },
      { header: 'Username', field: 'username' },
      {
        field: 'actions',
        header: 'Actions',
        type: 'action',
        actions: [
          { label: 'Remove', action: (row: any) => this.removeReviewer(row) },
        ]
      }
    ];
  
    approveColumns = [
      { header: 'ID', field: 'id' },
      { header: 'Email', field: 'email' },
      { header: 'First Name', field: 'firstName' },
      { header: 'Last Name', field: 'lastName' },
      { header: 'Username', field: 'username' },
    ];
  
    reviewersRows: any[] = []; // Dynamically store fetched data
    approvedReviewersRows: any[] = [];
    limit = 10;       // Rows per page
    offsetApproved = 0;
    offsetPending = 0;
    totalPagesPending = 0;
    totalPagesApproved = 0;
    viewEnableSelection = false; // Allow parent-controlled selection
    approveEnableSelection = true;
    activeTab: number = 0;
  
    constructor(private sectionalReviewerService: SectionalReviewerService,public loaderService: LoaderService) {}
  
    ngOnInit() {
      this.fetchApprovedReviewers();
    }
    onOffsetApprovedChange(newOffset: number) {
      this.offsetApproved = newOffset;
      this.fetchApprovedReviewers(); // Fetch new data based on page
    }
    onOffsetPendingChange(newOffset: number) {
      this.offsetPending = newOffset;
      this.fetchReviewers(); // Fetch new data based on page
    }
    onTabChange(index: number) {
      this.activeTab = index;
      if (index === 0) {
        this.approvedReviewersRows = [];
        this.fetchApprovedReviewers();
      } else {
        this.reviewersRows = [];
        this.fetchReviewers();
      }
    }
  
    async fetchReviewers() {
      this.loaderService.show();
      this.reviewersRows = [];
      try {
        const response = await this.sectionalReviewerService.getReviewers(this.limit,this.offsetPending).toPromise();
        this.reviewersRows = response?.data?.reviewerDto.map((reviewer: any) => ({
          ...reviewer,
          selected: false
        }));
        this.totalPagesPending = response?.pagination?.totalPages || 1;
      } catch (error) {
        console.error('Error fetching reviewers:', error);
      } finally {
        this.loaderService.hide();
      }
    }
  
    async fetchApprovedReviewers() {
      this.loaderService.show();
      this.approvedReviewersRows = [];
      try {
        const response = await this.sectionalReviewerService.getApprovedReviewers(this.limit,this.offsetApproved).toPromise();
        this.approvedReviewersRows = response?.data?.reviewerDto.map((reviewer: any) => ({
          ...reviewer,
          selected: false
        }));
        this.totalPagesApproved = response?.pagination?.totalPages || 1;;
      } catch (error) {
        console.error('Error fetching approved reviewers:', error);
      } finally {
        this.loaderService.hide();
      }
    }
  
    hasSelectedReviewers(): boolean {
      return this.reviewersRows.some(reviewer => reviewer.selected);
    }
  
    approveReviewer() {
      const selectedReviewers = this.reviewersRows.filter(reviewer => reviewer.selected)
        .map(({ selected, ...reviewer }) => reviewer);
      
      if (selectedReviewers.length === 0) {
        console.warn('No reviewers selected for approval.');
        return;
      }
      
      this.loaderService.show();
      this.sectionalReviewerService.approveReviewer({ reviewerDto: selectedReviewers }).subscribe({
        next: () => {
          this.reviewersRows = this.reviewersRows.filter(reviewer => !reviewer.selected);
          this.offsetPending = 0;
          this.fetchReviewers();
        },
        error: (error) => console.error('Error approving reviewers', error),
        complete: () => this.loaderService.hide()
      });
    }
  
    removeReviewer(row: any) {
      const selectedReviewers = [{ ...row }];
      delete selectedReviewers[0].selected;
      
      this.loaderService.show();
      this.sectionalReviewerService.removeReviewer({ reviewerDto: selectedReviewers }).subscribe({
        next: () =>{this.offsetApproved = 0;
          this.fetchApprovedReviewers();
        },
        error: (error) => console.error('Error removing reviewer', error),
        complete: () => this.loaderService.hide()
      });
    }
  
    rejectReviewer() {
      const selectedReviewers = this.reviewersRows.filter(reviewer => reviewer.selected)
        .map(({ selected, ...reviewer }) => reviewer);
      
      if (selectedReviewers.length === 0) {
        console.warn('No reviewers selected for rejection.');
        return;
      }
      
      this.loaderService.show();
      this.sectionalReviewerService.rejectReviewer({ reviewerDto: selectedReviewers }).subscribe({
        next: () => {
          this.reviewersRows = this.reviewersRows.filter(reviewer => !reviewer.selected);
          this.offsetPending = 0;
          this.fetchReviewers();
        },
        error: (error) => console.error('Error rejecting reviewers', error),
        complete: () => this.loaderService.hide()
      });
    }
}
