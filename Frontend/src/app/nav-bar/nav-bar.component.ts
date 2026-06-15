import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ManuscriptService } from '../services/manuscript-details.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

declare var bootstrap: any; // Import Bootstrap JavaScript manually

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, AfterViewInit {
  @ViewChild('profileSidebar') profileSidebar!: ElementRef;
  isLoggedIn: boolean = false;
  user: string | null = null;
  userRole: string | null = null;
  bsOffcanvas: any;
  profileMenuItems: { label: string; link: string; icon?: string; action?: () => void; }[] = [];

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private manuscriptService: ManuscriptService,
    private cdRef: ChangeDetectorRef,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.user = sessionStorage.getItem('userEmail'); 
      this.userRole = sessionStorage.getItem('userRole'); 
      this.setProfileMenuItems(); // Set profile menu based on user role
    });
  }

  ngAfterViewInit(): void {
    if (this.profileSidebar) {
      this.bsOffcanvas = new bootstrap.Offcanvas(this.profileSidebar.nativeElement);
    }
  }

  closeSidebar() {
    if (this.bsOffcanvas) {
      this.bsOffcanvas.hide();
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole'); 
      this.router.navigate(['/login']);
      this.bsOffcanvas.hide(); 
    });
  }

  submitManuscript() {
    this.manuscriptService.setStage(1);
    this.router.navigate(['/submit-manuscript/details']);
  }  

  setProfileMenuItems() {
    this.profileMenuItems = [
      { label: '🚪 Logout', link: '/logout', icon: 'text-danger logout-btn',action: () => this.logout()}
    ];
  
    const roleMenus: { [key: string]: { label: string; link: string }[] } = {
      EDITOR: [
        { label: '👥 Editors', link: '/editor-dashboard' },
        { label: '🔎 Sectional Reviewers', link: '/sectional-reviewer-dashboard' },
        { label: '🕵️‍♂️ Reviewers', link: '/reviewer-dashboard' },
        { label: '📄 Manuscripts', link: '/manuscript-dashboard' }
      ],
      AUTHOR: [{ label: '📝 Author Dashboard', link: '/author-dashboard' }],
      SECTIONAL_REVIEWER: [
        { label: '🕵️‍♂️ Reviewers', link: '/reviewer-dashboard' },
        { label: '📄 Manuscripts', link: '/manuscript-dashboard' }],
      REVIEWER: [{ label: '✅ Reviewer Dashboard', link: '/review-papers' }]
    };
  
    if (this.userRole && roleMenus[this.userRole]) {
      this.profileMenuItems.unshift(...roleMenus[this.userRole]);
    }
  }
  navigate(link: string) {
    this.router.navigate([link]);
  }
  
}
