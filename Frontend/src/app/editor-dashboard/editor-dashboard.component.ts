import { Component, OnInit } from '@angular/core';
import { EditorService } from '../services/editor.service';
import { LoaderService } from '../services/loader.service'; 

@Component({
  selector: 'app-editor-dashboard',
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.scss']
})
export class EditorDashboardComponent implements OnInit {
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
        { label: 'Remove', action: (row: any) => this.removeEditor(row) },
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

  editorsRows: any[] = []; // Dynamically store fetched data
  approvedEditorsRows: any[] = [];
  limit = 10;  // Rows per page
  viewEnableSelection = false; // Allow parent-controlled selection
  approveEnableSelection = true;
  totalPagesApproved = 1;
  totalPagesPending = 1;
  offsetApproved = 0;
  offsetPending = 0;  // Pagination offset
  currentPageApproved = 1; // Track current page for approved editors
  currentPagePending = 1;  // Track current page for pending editors

  activeTab: number = 0;

  constructor(private editorService: EditorService,public loaderService: LoaderService) {}

  ngOnInit() {
    this.fetchApprovedEditors();
  }

  onTabChange(index: number) {
    this.activeTab = index;
    this.offsetPending = 0; 
    this.offsetApproved = 0; // Reset offset on tab change
    if (index === 0) {
      this.currentPageApproved = 1; // Reset page number
      this.approvedEditorsRows = [];
      this.fetchApprovedEditors();
    } else {
      this.currentPagePending = 1; // Reset page number
      this.editorsRows = [];
      this.fetchEditors();
    }
  }
  onOffsetApprovedChange(newOffset: number) {
    this.offsetApproved = newOffset;
    this.fetchApprovedEditors(); // Fetch new data based on page
  }
  onOffsetPendingChange(newOffset: number) {
    this.offsetPending = newOffset;
    this.fetchEditors(); // Fetch new data based on page
  }
  async fetchEditors() {
    this.loaderService.show();
    this.editorsRows = [];
    try {
      const response = await this.editorService.getEditors(this.limit, this.offsetPending).toPromise();
      
      this.editorsRows = response?.data?.reviewerDto.map((editor: any) => ({
        ...editor,
        selected: false
      })) || [];
  
      this.totalPagesPending = response?.pagination?.totalPages || 1; // Get total pages
    } catch (error) {
      console.error('Error fetching editors:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchApprovedEditors() {
    this.loaderService.show();
    this.approvedEditorsRows = [];
    try {
      const response = await this.editorService.getApprovedEditors(this.limit, this.offsetApproved).toPromise();
      
      this.approvedEditorsRows = response?.data?.reviewerDto.map((editor: any) => ({
        ...editor,
        selected: false
      })) || [];
  
      this.totalPagesApproved = response?.pagination?.totalPages || 1; // Get total pages
    } catch (error) {
      console.error('Error fetching approved editors:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  hasSelectedReviewers(): boolean {
    return this.editorsRows.some(editor => editor.selected);
  }

  approveEditor() {
    const selectedReviewers = this.editorsRows.filter(editor => editor.selected)
      .map(({ selected, ...editor }) => editor);
    
    if (selectedReviewers.length === 0) {
      console.warn('No reviewers selected for approval.');
      return;
    }
    
    this.loaderService.show();
    this.editorService.approveEditor({ reviewerDto: selectedReviewers }).subscribe({
      next: () => {
        this.editorsRows = this.editorsRows.filter(editor => !editor.selected);
        this.offsetApproved = 0;
        this.fetchEditors();
      },
      error: (error) => console.error('Error approving reviewers', error),
      complete: () => {this.loaderService.hide()
        
      }
    });
  }

  removeEditor(row: any) {
    const selectedReviewers = [{ ...row }];
    delete selectedReviewers[0].selected;
    
    this.loaderService.show();
    this.editorService.removeEditor({ reviewerDto: selectedReviewers }).subscribe({
      next: () => {this.offsetApproved = 0;
        this.fetchApprovedEditors()},
      error: (error) => console.error('Error removing editor', error),
      complete: () => {this.loaderService.hide();
        
      }
    });
  }

  rejectEditor() {
    const selectedReviewers = this.editorsRows.filter(editor => editor.selected)
      .map(({ selected, ...editor }) => editor);
    
    if (selectedReviewers.length === 0) {
      console.warn('No reviewers selected for rejection.');
      return;
    }
    
    this.loaderService.show();
    this.editorService.rejectEditor({ reviewerDto: selectedReviewers }).subscribe({
      next: () => {
        this.editorsRows = this.editorsRows.filter(editor => !editor.selected);
        this.offsetPending = 0;
        this.fetchEditors();
      },
      error: (error) => console.error('Error rejecting reviewers', error),
      complete: () => {this.loaderService.hide()
        
      }
    });
  }
}
