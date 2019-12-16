import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CasesService, ICases, IUsersPagination, IUser, ISkills, CaseStatus, IUsersWithSkills, IEmployeeSkills } from '../../Cases/_services/cases.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-assign-staff',
  templateUrl: './assign-staff.component.html',
  styleUrls: ['./assign-staff.component.css']
})
export class AssignStaffComponent implements OnInit {

    @Input() case: ICases; // change to ICases (had to add several new properties to the interface) 
    @Input() deadlineToSetMessage: boolean;
    @Output() passAssignedStaff: EventEmitter<Array<string>> = new EventEmitter();
    @Output() passCase: EventEmitter<any> = new EventEmitter();
    @Output() passDeadlineToSetMessage: EventEmitter<boolean> = new EventEmitter(); 
    
    private errorMsg;
    private id: string;
    private userRole: any; // not sure if I can use a type for this
    private users: IUser; // used to hold just the users (excluding pagination properties)
    private usersP: IUsersPagination;
    private assignedStaff: Array<string> = [];
    private assignedStaffNames: Array<string> = [];
    private assignStaffFlag: boolean = false;
    private isUserContact: boolean = false;
    private isUserDeveloper: boolean = false;
    private userId: string;
    private employeesSkills: Array<IEmployeeSkills>; // was any which worked so change back if any problems
    private usersWithSkills: Array<IUsersWithSkills>; // was any which worked so change back if any problems
    private allSkillsHeadings: Array<string>;
    private skills: Array<ISkills>;

    // old copies of staff assigned to enable Cancel easily
    private assignedStaffOld: Array<string> = []; 
    private caseContactIdOld: string;
    private caseContactInfoIdOld: string;
    private caseContactInfoFirstNameOld: string;
    private caseContactInfoLastNameOld: string;
    private caseContactInfoEmailOld: string;
    private caseContactInfoUserNameOld: string;

    // pagination sort/filter/search properties:
    private sortProperty: string = "";
    private sortAsc: boolean = true;
    private skillFilter: number = 0;
    private skillTypeFilter: number = 0;
    private searchModel: searchModel = { skillSearch: "" }; // skills
    // pagination properties:
    private pageIndex: number;
    private pagesBefore: Array<number> = [];
    private pagesAfter: Array<number> = [];
    private maxPagesEitherSide: number = 4;

    private CaseStatusEnum = CaseStatus;


    constructor(private casesService: CasesService, private _route: ActivatedRoute, private router: Router, private authorize: AuthorizeService,
        private elementRef: ElementRef) {
        this.id = _route.snapshot.paramMap.get("id");
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF"; 
    }

    ngOnInit() {
        this.assignedStaff = this.case.staffAssigned ? this.case.staffAssigned.split(', ') : [];
        this.assignedStaffOld = this.assignedStaff.slice();
        this.saveOldContact();
        this.populateAssignedStaffNames(); 
        this.authorize.getUser().pipe(map(u => u && u.userId)).subscribe( 
            userId => {
                this.userId = userId;
                this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
                this.isUserContact = this.case.contactId == this.userId ? true : false;
        });

        this.casesService.getSkills("id", true).subscribe(result => {
            this.skills = result;
        }, errors => this.errorMsg = errors);

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    updateCase(form = null) {
        this.casesService.updateCase(this.case).subscribe(result => {
        }, errors => this.errorMsg = errors);
        if (form) form.reset();
    }


    // Used only in OnInit (and Cancel Assignment)
    populateAssignedStaffNames() {
        this.assignedStaffNames = [];
        var fullName = "";
        for (var id of this.assignedStaff) {
            this.casesService.getUser(id).subscribe(result => {
                fullName = result.firstName + " " + result.lastName;
                this.assignedStaffNames.push(fullName);
            }, errors => this.errorMsg = errors);
        }
    }

    assignEmployee(id: string) {
        // add or subtract employee to/from staff assigned to case list unless already on the list
        if (this.assignedStaff.includes(id)) {
            this.assignedStaff = this.assignedStaff.filter(e => e !== id);

            var name = this.users.find(i => i.id === id); //
            var fullName = name.firstName + " " + name.lastName;
            this.assignedStaffNames = this.assignedStaffNames.filter(e => e !== fullName);
        } else {
            this.assignedStaff.push(id);

            var name = this.users.find(i => i.id === id); //
            var fullName = name.firstName + " " + name.lastName;
            this.assignedStaffNames.push(fullName);
        }
    }

    saveOldContact() {
        this.caseContactIdOld = this.case.contactId;
        // need to also set the contactInfo object properties
        this.caseContactInfoIdOld = this.case.contactInfo.contactId;
        this.caseContactInfoFirstNameOld = this.case.contactInfo.firstName;
        this.caseContactInfoLastNameOld = this.case.contactInfo.lastName;
        this.caseContactInfoEmailOld = this.case.contactInfo.email;
        this.caseContactInfoUserNameOld = this.case.contactInfo.userName;
    }

    getOldContact() {
        this.case.contactId = this.caseContactIdOld;
        // need to also set the contactInfo object properties
        this.case.contactInfo.contactId = this.caseContactInfoIdOld;
        this.case.contactInfo.firstName = this.caseContactInfoFirstNameOld;
        this.case.contactInfo.lastName = this.caseContactInfoLastNameOld;
        this.case.contactInfo.email = this.caseContactInfoEmailOld;
        this.case.contactInfo.userName = this.caseContactInfoUserNameOld;
    }

    assignContact(id: string, firstName, lastName, email, userName) {
        this.case.contactId = id;
        // need to also set the contactInfo object properties
        this.case.contactInfo.contactId = id;
        this.case.contactInfo.firstName = firstName;
        this.case.contactInfo.lastName = lastName;
        this.case.contactInfo.email = email;
        this.case.contactInfo.userName = userName;
    }

    submitAssignedStaff(assignForm) {
        this.assignStaffFlag = false;
        this.case.staffAssigned = this.assignedStaff.join(", ");

        // set status to assigned and assigned date once a contact is assigned and don't change the date or status if another contact is assigned
        if (this.case.contactId && !this.case.dateAssigned) {
            this.case.dateAssigned = new Date(); // .toISOString(); // can't remember why I did this so have removed
            this.case.status = this.case.status < this.CaseStatusEnum.Assigned ? this.CaseStatusEnum.Assigned : this.case.status; 
        }

        this.updateCase(assignForm);
        this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
        this.isUserContact = this.case.contactId == this.userId ? true : false;

        this.passAssignedStaff.emit(this.assignedStaff);
        this.passCase.emit(this.case); // case.status, case.staffAssigned case.contactId

        this.assignedStaffOld = this.assignedStaff.slice();
        this.saveOldContact();
    }

    cancelStaffAssignment() {
        this.assignStaffFlag = false;
        // need to remove them from the array this.assignedStaff
        this.assignedStaff = this.assignedStaffOld.slice();
        this.populateAssignedStaffNames();
        this.passAssignedStaff.emit(this.assignedStaff);
        this.getOldContact();
        this.passCase.emit(this.case); // case.status, case.staffAssigned case.contactId
    }

    showAssignEmployeeSection(caseId) {
        // need to restrict to managers only
        if (this.case.deadline == null) {
            this.deadlineToSetMessage = true;
            this.passDeadlineToSetMessage.emit(this.deadlineToSetMessage); //**
            return;
        }
        this.deadlineToSetMessage = false;
        this.passDeadlineToSetMessage.emit(this.deadlineToSetMessage); //** 
        this.assignStaffFlag = true;
        // add filters later: this.skillFilter - need to put on html
        this.casesService.getUsersByRoleBySkill("employee", this.skillFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.skillSearch).subscribe(result => {
            this.usersP = result;
            this.users = this.usersP.users;
            this.populateUsersListWithSkills();
            this.pageIndex = this.usersP.pageIndex;
            this.setPagination();
        }, errors => this.errorMsg = errors);


    }

    populateUsersListWithSkills() {
        var skill = 0; // 0 = all skills. This is not the same as "this.skillFilter"
        this.casesService.getAllSkillsOfAllEmployees(this.users, skill).subscribe(result => {
            this.employeesSkills = result;
            //this.usersWithSkills = this.users.slice(); // this only shallow copies to one level so no good if skills:{} used
            this.usersWithSkills = JSON.parse(JSON.stringify(this.users)); // this is a deep copy so ok for skills (and it's a simple object)

            // loop through employeesSkills and get an array of distinct skills for the headings
            this.allSkillsHeadings = [];
            for (var i = 0; i < this.employeesSkills.length; i++) {
                if (!this.allSkillsHeadings.includes(this.employeesSkills[i].skills.name)) {
                    // if a skills type filter is being used only add it as a heading if it is that type
                    if (this.skillTypeFilter == 0 || this.skillTypeFilter == this.employeesSkills[i].skills.type) {
                        this.allSkillsHeadings.push(this.employeesSkills[i].skills.name);
                    }
                }
            }

            // initialize each skill in each user as null so it is used/displayed in the html
            for (var u = 0; u < this.usersWithSkills.length; u++) {
                for (var i = 0; i < this.allSkillsHeadings.length; i++) {
                    //this.usersWithSkills[u][this.allSkillsHeadings[i]] = null; // if Object for skills not used
                    var pair = { [this.allSkillsHeadings[i]]: null };
                    // merge new skill object into usersWithSkills object (using spread operator)
                    this.usersWithSkills[u].skills = { ...this.usersWithSkills[u].skills, ...pair }; 
                }
            }

            // add a new property in each user for each level of experience in a skill so user array is still flat
            for (var i = 0; i < this.employeesSkills.length; i++) {
                // if a skills type filter is being used only add the data if it is that type
                if (this.skillTypeFilter == 0 || this.skillTypeFilter == this.employeesSkills[i].skills.type) {
                    var userIndex = this.users.findIndex(a => a.id == this.employeesSkills[i].userId);
                    //this.usersWithSkills[userIndex][this.employeesSkills[i].skills.name] = this.employeesSkills[i].experience; // if Object for skills not used
                    this.usersWithSkills[userIndex].skills[this.employeesSkills[i].skills.name] = this.employeesSkills[i].experience;
                }
            }
            
        }, errors => this.errorMsg = errors);
    }


    showHideType(type) {
        this.skillTypeFilter = type;
        this.populateUsersListWithSkills();
    }

    // skill search
    onKeySearch(form) {
        this.searchModel.skillSearch = form.controls.skillSearch.value == null ? "" : form.controls.skillSearch.value;
        this.casesService.getUsersByRoleBySkill("employee", this.skillFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.skillSearch).subscribe(result => {
            this.usersP = result;
            this.users = this.usersP.users;
            this.populateUsersListWithSkills();
            this.pageIndex = 1;
            this.setPagination();
        }, errors => this.errorMsg = errors);
    }

    chooseSkillFilter(e) {
        this.casesService.getUsersByRoleBySkill("employee", this.skillFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.skillSearch).subscribe(result => {
            this.usersP = result;
            this.users = this.usersP.users;
            this.populateUsersListWithSkills();
            this.pageIndex = 1;
            this.setPagination();
        }, errors => this.errorMsg = errors);
    }

    sortEmployees(sortProperty) {
        if (sortProperty == this.sortProperty) this.sortAsc = !this.sortAsc;
        this.sortProperty = sortProperty;
        this.casesService.getUsersByRoleBySkill("employee", this.skillFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.skillSearch).subscribe(result => {
            this.usersP = result;
            this.users = this.usersP.users;
            this.populateUsersListWithSkills();
            this.pageIndex = 1;
            this.setPagination();
        }, errors => this.errorMsg = errors);
    }

    setPagination() {
        this.pagesBefore = [];
        this.pagesAfter = [];
        for (var i = this.usersP.pageIndex - this.maxPagesEitherSide; i < this.usersP.pageIndex; i++) {
            if (i > 0) this.pagesBefore.push(i);
        }
        for (var i = (this.usersP.pageIndex + 1); i <= this.usersP.totalPages; i++) {
            this.pagesAfter.push(i);
            if (i >= this.usersP.pageIndex + this.maxPagesEitherSide) break;
        }
    }

    pageChangedHandler(page: number) {
        this.casesService.getUsersByRoleBySkill("employee", this.skillFilter, this.sortProperty, this.sortAsc, page, this.searchModel.skillSearch).subscribe(result => {
            this.usersP = result;
            this.users = this.usersP.users;
            this.populateUsersListWithSkills();
            this.pageIndex = this.usersP.pageIndex;
            this.setPagination();
        }, errors => this.errorMsg = errors);
    }

}

interface searchModel {
    skillSearch: string;
}
