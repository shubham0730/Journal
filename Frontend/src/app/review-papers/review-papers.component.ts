import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service'; 
import { ReviewerService } from '../services/reviewer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-papers',
  templateUrl: './review-papers.component.html',
  styleUrls: ['./review-papers.component.scss']
})
export class ReviewPapersComponent implements OnInit{
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

    },{
    field: 'actions',
    header: 'Actions',
    type: 'action',
    actions: [
      { label: 'View', action: (row: any) => this.navigateToManuscriptStatus(row)}
    ]
  }
];


  manuscripts: any[] = []; // Dynamically store fetched data
  limit = 10;       // Rows per page
  offset = 0;
  enableSelection = false; // Allow parent-controlled selection
  activeTab: number = 0;
  totalPages = 1;
  
  constructor(public loaderService: LoaderService,private router: Router,private reviewerService: ReviewerService,) {}

  ngOnInit() {
    this.fetchManuscripts();
  }

  onTabChange(index: number) {
    this.activeTab = index;
    if (index === 0) {
      this.manuscripts = [];
      this.fetchManuscripts();
    }
  }

  onOffsetChange(newOffset: number) {
    this.offset = newOffset;
    this.fetchManuscripts(); // Fetch new data based on page
  }

  async fetchManuscripts() {
    this.loaderService.show();
    this.manuscripts = [];
    try {
      const response = await this.reviewerService.getManuscripts(sessionStorage.getItem('username') || '',this.limit,this.offset).toPromise();
      this.manuscripts = response?.data?.map((row: any) => ({
        ...row,
        selected: false,
        fileMods:row.fileMods
      }));
      this.totalPages = response?.pagination?.totalPages || 1;
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  navigateToManuscriptStatus(data:any) {
    const dataWithReturn = { ...data, returnUrl: this.router.url };
  this.router.navigateByUrl('/manuscript-status', { state: dataWithReturn });
    }

}
