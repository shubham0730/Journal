import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from './authentication/login-page/login-page.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { AuthorInfoComponent } from './pages/author-info/author-info.component';
import { EditorialBoardComponent } from './editorial-board/editorial-board.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { AboutJournalComponent } from './pages/about-journal/about-journal.component';
import { AfiliatedSocietyComponent } from './pages/afiliated-society/afiliated-society.component';
import { UploadManuscriptComponent } from './upload-manuscript/upload-manuscript.component';
import { SubmitManuscriptDetailsComponent } from './submit-manuscript-details/submit-manuscript-details.component';
import { SubmitManuscriptInstitutionDetailsComponent } from './submit-manuscript-institution-details/submit-manuscript-institution-details.component';
import { CompleteSubmitComponent } from './complete-submit/complete-submit.component';
import { EditTablegridComponent } from './edit-tablegrid/edit-tablegrid.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CurrentIssueComponent } from './current-issue/current-issue.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './services/auth.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { ReviewerDashboardComponent } from './reviewer-dashboard/reviewer-dashboard.component';
import { MyPublicationsComponent } from './my-publications/my-publications.component';
import { SectionalReviewerDashboardComponent } from './sectional-reviewer-dashboard/sectional-reviewer-dashboard.component';
import { EditorDashboardComponent } from './editor-dashboard/editor-dashboard.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ManuscriptDashboardComponent } from './manuscript-dashboard/manuscript-dashboard.component';
import { ManuscriptStatusComponent } from './manuscript-status/manuscript-status.component';
import { ReviewerDialogComponent } from './reviewer-dialog/reviewer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SessionTimeoutDialogComponent } from './session-timeout-dialog/session-timeout-dialog.component';
import { ReviewPapersComponent } from './review-papers/review-papers.component';
import { DecisionModalComponent } from './decision-modal/decision-modal.component';
import { AuthorDashboardComponent } from './author-dashboard/author-dashboard.component';
import { ResubmissionStepperComponent } from './resubmission-stepper/resubmission-stepper.component'
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeScreenComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AuthorInfoComponent,
    EditorialBoardComponent,
    DynamicTableComponent,
    AboutJournalComponent,
    AfiliatedSocietyComponent,
    UploadManuscriptComponent,
    SubmitManuscriptDetailsComponent,
    EditTablegridComponent,
    CompleteSubmitComponent,
    SubmitManuscriptInstitutionDetailsComponent,
    TabBarComponent,
    ReviewerDashboardComponent,
    CurrentIssueComponent,
    MyPublicationsComponent,
    SectionalReviewerDashboardComponent,
    EditorDashboardComponent,
    PaginationComponent,
    ManuscriptDashboardComponent,
    ManuscriptStatusComponent,
    ReviewerDialogComponent,
    SessionTimeoutDialogComponent,
    ReviewPapersComponent,
    DecisionModalComponent,
    AuthorDashboardComponent,
    ResubmissionStepperComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    DragDropModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatStepperModule,
    MatSelectModule,
    MatCardModule,
    NgbModule
  ],
  exports: [
    EditTablegridComponent // Exporting for usage in other modules
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
