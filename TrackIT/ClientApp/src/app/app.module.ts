import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//import "jquery";    // added to get ability to use dropdown nav menu
//import "bootstrap"; // added to get ability to use dropdown nav menu
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { CasesListComponent } from './Cases/cases-list/cases-list.component';
import { CaseDisplayComponent } from './Cases/case-display/case-display.component';
import { CaseAddComponent } from './Cases/case-add/case-add.component';
import { CasesListSupportComponent } from './CasesSupport/cases-list-support/cases-list-support.component';
import { CaseDisplaySupportComponent } from './CasesSupport/case-display-support/case-display-support.component';
import { FromToPipe } from '../pipes/from-to.pipe';
import { AddSoftwareComponent } from './Admin/Software/add-software/add-software.component';
import { ViewSoftwareComponent } from './Admin/Software/view-software/view-software.component';
import { EditSoftwareComponent } from './Admin/Software/edit-software/edit-software.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ViewEmployeesComponent } from './Admin/Employees/view-employees/view-employees.component';
import { EditEmployeeComponent } from './Admin/Employees/edit-employee/edit-employee.component';
import { ViewMessagesComponent } from './Messages/view-messages/view-messages.component';
import { UploadFilesComponent } from './FileUpload/upload-files/upload-files.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { ViewSkillsComponent } from './Admin/Skills/view-skills/view-skills.component';
import { EditSkillsComponent } from './Admin/Skills/edit-skills/edit-skills.component';
import { AddSkillsComponent } from './Admin/Skills/add-skills/add-skills.component';
import { AddSkillsToEmployeeComponent } from './Admin/Employees/EmployeeSkills/add-skills-to-employee/add-skills-to-employee.component';
import { ViewSkillsOfEmployeeComponent } from './Admin/Employees/EmployeeSkills/view-skills-of-employee/view-skills-of-employee.component';
import { EditSkillsOfEmployeeComponent } from './Admin/Employees/EmployeeSkills/edit-skills-of-employee/edit-skills-of-employee.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssignStaffComponent } from './CasesSupport/assign-staff/assign-staff.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CasesListComponent,
    CaseDisplayComponent,
    CaseAddComponent,
    CasesListSupportComponent,
    CaseDisplaySupportComponent,
    FromToPipe,
    AddSoftwareComponent,
    ViewSoftwareComponent,
    EditSoftwareComponent,
    PaginationComponent,
    ViewEmployeesComponent,
    EditEmployeeComponent,
    ViewMessagesComponent,
    UploadFilesComponent,
    ShowErrorsComponent,
    ViewSkillsComponent,
    EditSkillsComponent,
    AddSkillsComponent,
    AddSkillsToEmployeeComponent,
    ViewSkillsOfEmployeeComponent,
    EditSkillsOfEmployeeComponent,
    PageNotFoundComponent,
    AssignStaffComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'cases-list', component: CasesListComponent , canActivate: [AuthorizeGuard] },
        { path: 'case-display/:id', component: CaseDisplayComponent , canActivate: [AuthorizeGuard] },
        { path: 'case-add', component: CaseAddComponent, canActivate: [AuthorizeGuard] },
        { path: 'cases-list-support', component: CasesListSupportComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin", "employee", "manager"] } },
        { path: 'case-display-support/:id', component: CaseDisplaySupportComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin", "employee", "manager"] } },
        { path: 'add-software', component: AddSoftwareComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'view-software', component: ViewSoftwareComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'edit-software/:id', component: EditSoftwareComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'view-employees', component: ViewEmployeesComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'edit-employee/:id', component: EditEmployeeComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'view-skills', component: ViewSkillsComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'edit-skill/:id', component: EditSkillsComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'add-skill', component: AddSkillsComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'view-employee-skills/:id', component: ViewSkillsOfEmployeeComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'add-employee-skills/:id', component: AddSkillsToEmployeeComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        { path: 'edit-employee-skills/:id', component: EditSkillsOfEmployeeComponent, canActivate: [AuthorizeGuard], data: { roles: ["admin"] } },
        {
            path: '**',
            pathMatch: 'full',
            component: PageNotFoundComponent
        }
    ]),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
