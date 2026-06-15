import { Component } from '@angular/core';
import { ManuscriptService } from '../services/manuscript-details.service'
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-manuscript-dashboard',
  templateUrl: './manuscript-dashboard.component.html',
  styleUrls: ['./manuscript-dashboard.component.scss']
})
export class ManuscriptDashboardComponent {
  isLoading: boolean = false; // Loader state

  viewColumns = [
    { header: 'ID', field: 'id' },
    { header: 'Article Type', field: 'articleType' },
    { header: 'Title', field: 'title' },
    { header: 'Status', field: 'status', type: 'status' },
    {
      header: 'Version',
      field: 'version',
      type: 'dropdown',
      getOptions: (row: any) => {
        const mods = row.fileMods || {};
        return Object.keys(mods)
          .map(Number)
          .sort((a, b) => a - b); // ascending sort
      },
      defaultValue: (row: any) => {
        const mods = row.fileMods || {};
        const versions = Object.keys(mods).map(Number);
        return versions.length ? Math.max(...versions) : null;
      }

    },
    {
      field: 'actions',
      header: 'Actions',
      type: 'action',
      actions: [
        { label: 'View', action: (row: any) => this.navigateToManuscriptStatus(row) }
      ]
    }
  ];

  paperRows: any[] = []; // Dynamically store fetched data
  limit = 5;  // Rows per page
  paperEnableSelection = false; // Allow parent-controlled selection
  totalPagesPaper = 1;
  offsetPaper = 0;
  currentPagePaper = 1; // Track current page for approved editors
  activeTab: number = 0;

  constructor(private manuscriptService: ManuscriptService, private router: Router, public loaderService: LoaderService) { }

  ngOnInit() {
    this.fetchPapers();
  }


  onTabChange(index: number) {
    this.activeTab = index;
    this.offsetPaper = 0;
    if (index === 0) {
      this.currentPagePaper = 1; // Reset page number
      this.paperRows = [];
      this.fetchPapers();
    }
  }
  onOffsetPaperChange(newOffset: number) {
    this.offsetPaper = newOffset;
    this.fetchPapers(); // Fetch new data based on page
  }

  async fetchPapers() {
    this.loaderService.show();
    this.paperRows = [];
    try {
      const response = await this.manuscriptService.getManuscripts(this.limit, this.offsetPaper).toPromise();

      this.paperRows = response?.data?.map((entry: any) => ({
        id: entry.id,
        articleType: entry.articleType,
        title: entry.title,
        username: entry.username,
        selected: false,
        status: entry.status,
        isLocked: entry.isLocked,
        fileMods: entry.fileMods || [] // ✅ attach per-row options here
      })) || [];

      this.totalPagesPaper = response?.pagination?.totalPages || 1;
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      this.loaderService.hide();
    }
  }



  hasSelectedPapers(): boolean {
    return this.paperRows.some(paper => paper.selected);
  }
  getStatusBadge(status: string): string {
    switch (status.toLowerCase()) {
      case 'unpublished':
        return 'badge bg-warning text-dark';
      case 'published':
        return 'badge bg-success';
      case 'under review':
        return 'badge bg-info text-dark';
      default:
        return 'badge bg-secondary';
    }
  }
  navigateToManuscriptStatus(data: any) {
    const dataWithReturn = { ...data, returnUrl: this.router.url };
    this.router.navigateByUrl('/manuscript-status', { state: dataWithReturn });
  }

}
