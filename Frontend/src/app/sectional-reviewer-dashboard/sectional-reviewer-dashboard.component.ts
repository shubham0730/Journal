import { Component, OnInit } from '@angular/core';
import { EditorService } from '../services/editor.service';
import { LoaderService } from '../services/loader.service'; 

@Component({
  selector: 'app-sectional-reviewer-dashboard',
  templateUrl: './sectional-reviewer-dashboard.component.html',
  styleUrls: ['./sectional-reviewer-dashboard.component.scss']
})
export class SectionalReviewerDashboardComponent implements OnInit {
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
        { label: 'Remove', action: (row: any) => this.removeSectionalReviewer(row) },
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

  sectionalReviewersRows: any[] = []; // Dynamically store fetched data
  approvedSectionalReviewersRows: any[] = [];
  limit = 10;       // Rows per page
  offsetApproved = 0;
  offsetPending = 0;
  viewEnableSelection = false; // Allow parent-controlled selection
  approveEnableSelection = true;
  activeTab: number = 0;
  totalPagesApproved = 1;
  totalPagesPending = 1;
  
  constructor(private editorService: EditorService,public loaderService: LoaderService) {}

  ngOnInit() {
    this.fetchApprovedSectionalReviewers();
  }

  onTabChange(index: number) {
    this.activeTab = index;
    if (index === 0) {
      this.approvedSectionalReviewersRows = [];
      this.fetchApprovedSectionalReviewers();
    } else {
      this.sectionalReviewersRows = [];
      this.fetchSectionalReviewers();
    }
  }

  onOffsetApprovedChange(newOffset: number) {
    this.offsetApproved = newOffset;
    this.fetchApprovedSectionalReviewers(); // Fetch new data based on page
  }
  onOffsetPendingChange(newOffset: number) {
    this.offsetPending = newOffset;
    this.fetchSectionalReviewers(); // Fetch new data based on page
  }

  async fetchSectionalReviewers() {
    this.loaderService.show();
    this.sectionalReviewersRows = [];
    try {
      const response = await this.editorService.getSectionalReviewers(this.limit,this.offsetPending).toPromise();
      
      this.sectionalReviewersRows = response?.data?.reviewerDto.map((editor: any) => ({
        ...editor,
        selected: false
      })) || [];
  
      this.totalPagesPending = response?.pagination?.totalPages || 1; 
    } catch (error) {
      console.error('Error fetching sectionalReviewers:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchApprovedSectionalReviewers() {
    this.loaderService.show();
    this.approvedSectionalReviewersRows = [];
    try {
      const response = await this.editorService.getApprovedSectionalReviewers(this.limit,this.offsetApproved).toPromise();
      this.approvedSectionalReviewersRows = response?.data?.reviewerDto.map((sectionalReviewer: any) => ({
        ...sectionalReviewer,
        selected: false
      }));
      this.totalPagesApproved = response?.pagination?.totalPages || 1;
    } catch (error) {
      console.error('Error fetching approved sectionalReviewers:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  hasSelectedReviewers(): boolean {
    return this.sectionalReviewersRows.some(sectionalReviewer => sectionalReviewer.selected);
  }

  approveSectionalReviwer() {
    const selectedReviewers = this.sectionalReviewersRows.filter(sectionalReviewer => sectionalReviewer.selected)
      .map(({ selected, ...sectionalReviewer }) => sectionalReviewer);
    
    if (selectedReviewers.length === 0) {
      console.warn('No reviewers selected for approval.');
      return;
    }
    
    this.loaderService.show();
    this.editorService.approveSectionalReviewer({ reviewerDto: selectedReviewers }).subscribe({
      next: () => {this.sectionalReviewersRows = this.sectionalReviewersRows.filter(sectionalReviewer => !sectionalReviewer.selected);
        this.offsetPending = 0;
        this.fetchSectionalReviewers();
      },
      error: (error) => console.error('Error approving reviewers', error),
      complete: () => this.loaderService.hide()
    });
  }

  removeSectionalReviewer(row: any) {
    const selectedReviewers = [{ ...row }];
    delete selectedReviewers[0].selected;
    
    this.loaderService.show();
    this.editorService.removeSectionalReviewer({ reviewerDto: selectedReviewers }).subscribe({
      next: () => {this.offsetApproved = 0;
        this.fetchApprovedSectionalReviewers();
      },
      error: (error) => console.error('Error removing sectionalReviewer', error),
      complete: () => this.loaderService.hide()
    });
  }

  rejectSectionalReviewer() {
    const selectedReviewers = this.sectionalReviewersRows.filter(sectionalReviewer => sectionalReviewer.selected)
      .map(({ selected, ...sectionalReviewer }) => sectionalReviewer);
    
    if (selectedReviewers.length === 0) {
      console.warn('No reviewers selected for rejection.');
      return;
    }
    
    this.loaderService.show();
    this.editorService.rejectSectionalReviewer({ reviewerDto: selectedReviewers }).subscribe({
      next: () => {
        this.sectionalReviewersRows = this.sectionalReviewersRows.filter(sectionalReviewer => !sectionalReviewer.selected);
        this.offsetPending = 0;
        this.fetchSectionalReviewers();
      },
      error: (error) => console.error('Error rejecting reviewers', error),
      complete: () => this.loaderService.hide()
    });
  }
}
