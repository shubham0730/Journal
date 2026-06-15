import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { AuthorInfoComponent } from './pages/author-info/author-info.component';
import { EditorialBoardComponent } from './editorial-board/editorial-board.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { AboutJournalComponent } from './pages/about-journal/about-journal.component';
import { LoginComponent } from './authentication/login-page/login-page.component';
import { AfiliatedSocietyComponent } from './pages/afiliated-society/afiliated-society.component';
import { DummySubmitComponent } from './dummy-submit/dummy-submit.component';
import { UploadManuscriptComponent } from './upload-manuscript/upload-manuscript.component';
import { SubmitManuscriptDetailsComponent } from './submit-manuscript-details/submit-manuscript-details.component';
import { SubmitManuscriptInstitutionDetailsComponent } from './submit-manuscript-institution-details/submit-manuscript-institution-details.component';
import { CompleteSubmitComponent } from './complete-submit/complete-submit.component';
import { EditTablegridComponent } from './edit-tablegrid/edit-tablegrid.component';
import { CurrentIssueComponent } from './current-issue/current-issue.component';
import { MyPublicationsComponent } from './my-publications/my-publications.component';
import { EditorDashboardComponent } from './editor-dashboard/editor-dashboard.component';
import { SectionalReviewerDashboardComponent } from './sectional-reviewer-dashboard/sectional-reviewer-dashboard.component';
import { ReviewerDashboardComponent } from './reviewer-dashboard/reviewer-dashboard.component';
import { ManuscriptDashboardComponent } from './manuscript-dashboard/manuscript-dashboard.component';
import { ManuscriptStatusComponent } from './manuscript-status/manuscript-status.component';
import { ReviewPapersComponent } from './review-papers/review-papers.component';
import { AuthorDashboardComponent} from './author-dashboard/author-dashboard.component';
const routes: Routes = [
  {path: '', component: HomeScreenComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'author/info', component: AuthorInfoComponent},
  {path: 'journal-info/editorial-board', component:EditorialBoardComponent},
  // {path: 'dynamic-table', component: DynamicTableComponent},
  {path: 'journal-info/about-journal', component: AboutJournalComponent},
  {path: 'journal-info/affiliated-society', component:AfiliatedSocietyComponent},
  {path:'dummy-submit', component:DummySubmitComponent},
  {path: 'submit-manuscript/upload', component: UploadManuscriptComponent},
  {path: 'submit-manuscript/details', component: SubmitManuscriptDetailsComponent},
  {path: 'submit-manuscript/institutional-details', component: SubmitManuscriptInstitutionDetailsComponent},
  {path:'submit-manuscript/complete-submission', component:CompleteSubmitComponent},
  {path: 'current-issue', component: CurrentIssueComponent},
  {path: 'my-publications', component: MyPublicationsComponent},
  {path: 'editor-dashboard', component: EditorDashboardComponent},
  {path: 'sectional-reviewer-dashboard', component: SectionalReviewerDashboardComponent},
  {path: 'reviewer-dashboard', component: ReviewerDashboardComponent},
  {path: 'manuscript-dashboard', component: ManuscriptDashboardComponent},
  {path: 'author-dashboard', component: AuthorDashboardComponent},
  {path :'manuscript-status', component:ManuscriptStatusComponent},
  {path: 'review-papers', component:ReviewPapersComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
