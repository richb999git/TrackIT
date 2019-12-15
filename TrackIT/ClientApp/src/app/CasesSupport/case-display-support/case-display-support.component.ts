import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IUsersPagination, IUser, ISkills } from '../../Cases/_services/cases.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-case-display-support',
  templateUrl: './case-display-support.component.html',
  styleUrls: ['./case-display-support.component.css']
})
export class CaseDisplaySupportComponent implements OnInit {

    private errorMsg;
    private case: any; // change to ICases? Need to make a lot of changes before I can
    private userRole: any; // not sure if I can use a type for this
    private id: string;
    private assignedStaff: Array<string> = [];
    private assignedStaffNames: Array<string> = [];
    private users: IUser; // used to hold just the users (excluding pagination properties)
    private usersP: IUsersPagination;
    private assignStaffFlag: boolean = false;
    private isUserContact: boolean = false;
    private isUserDeveloper: boolean = false;
    private userId: string;
    private estHoursEntry: boolean = false;
    private hoursSpentEntry: boolean = false;
    private estHoursModel: IEstHoursModel = { estimatedTimeHours: 0 };
    private hoursSpentModel: IHoursSpentModel = { timeSpentHours: 0 };
    private deadlineModel: IDeadlineModel = { deadline: new Date() };
    private employeesSkills: any; // change later
    private usersWithSkills: any; // change late
    private allSkillsHeadings: Array<string>;
    private skills: Array<ISkills>;
    private deadlineToSetMessage: boolean = false;

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


    constructor(private casesService: CasesService, private _route: ActivatedRoute, private router: Router, private authorize: AuthorizeService,
                private elementRef: ElementRef) {
        this.id = _route.snapshot.paramMap.get("id");
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF"; // #DDFFEF
    }

    ngOnInit() {
        this.casesService.getCase(this.id).subscribe(result => {
            this.case = result;
            this.assignedStaff = this.case.staffAssigned ? this.case.staffAssigned.split(', ') : []; // used in employee assignment
            this.populateAssignedStaffNames(); // used in employee assignment
            this.authorize.getUser().pipe(map(u => u && u.userId)).subscribe(
                userId => {
                    this.userId = userId;
                    this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
                    this.isUserContact = this.case.contactId == this.userId ? true : false;
                });

        }, errors => this.errorMsg = errors);

        // used in employee assignment
        this.casesService.getSkills("id", true).subscribe(result => {
            this.skills = result;
        }, errors => this.errorMsg = errors);

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    showEstHoursForm() {
        this.estHoursEntry = !this.estHoursEntry;
    }

    onSubmitEstHours(estHoursForm) {
        this.case.estimatedTimeHours = this.estHoursModel.estimatedTimeHours;
        this.updateCase(estHoursForm);
        this.estHoursEntry = false;
    }

    showHoursSpentForm() {
        this.hoursSpentEntry = !this.hoursSpentEntry;
    }

    onSubmitHoursSpent(hoursSpentForm) {
        this.case.timeSpentHours = this.hoursSpentModel.timeSpentHours;
        this.updateCase(hoursSpentForm);
        this.hoursSpentEntry = false;
    }

    onSubmitDeadline(setDeadlineForm) {
        this.case.deadline = this.deadlineModel.deadline;
        this.deadlineToSetMessage = false;
        this.updateCase(setDeadlineForm);
    }

    onSubmitAwaitCust(awaitCustForm) {
        // only effective in the message phase not if bug/feature starts to get implemented
        if (this.case.status == 2) {
            this.case.status = 3;
            this.updateCase(awaitCustForm);
        } else {
            if (this.case.status == 3) {
                this.case.status = 2;
                this.updateCase(awaitCustForm);
            }
        }
    }

    onSubmitComplete(completeForm) {
        if (this.case.status == 7) {
            this.case.status = 2;
            this.case.dateCompleted = null;
            this.updateCase(completeForm);
        } else {
            if (this.case.status != 7) {
                this.case.status = 7;
                this.case.dateCompleted = new Date();
                this.updateCase(completeForm);
            }
        }
    }

    onSubmitOnHold(onHoldForm) {
        if (this.case.status == 4) {
            this.case.status = 2;
            this.updateCase(onHoldForm);
        } else {
            if (this.case.status <= 3) {
                this.case.status = 4;
                this.updateCase(onHoldForm);
            }
        }
    }

    submitFix() {
        this.case.status = 5;
        this.case.dateAwaitApproval = new Date();
        this.updateCase();
    }

    submitFixApproval() {
        this.case.status = 6;
        this.case.dateApproved = new Date();
        this.updateCase();
    }

    submitFixApplied() {
        this.case.status = 7;
        this.case.dateApplied = new Date();
        this.case.dateCompleted = new Date();
        this.updateCase();
    }

    updateCase(form = null) {
        this.casesService.updateCase(this.case).subscribe(result => {
        }, errors => this.errorMsg = errors);
        if (form) form.reset();
    }

    // if assignment split then this will be needed (see submitAssignedStaff()  )
    updateCase2(form = null) {
        this.casesService.updateCase(this.case).subscribe(result => {
        }, errors => this.errorMsg = errors);
        if (form) form.reset();
    }


    //---------------- Assign employees methods ----------------------------------------------------------------------//

    // Used only in OnInit
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
            this.case.dateAssigned = new Date().toISOString();
            this.case.status = this.case.status < 2 ? 2 : this.case.status; // use enum?
        }

        this.updateCase(assignForm);
        this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
        this.isUserContact = this.case.contactId == this.userId ? true : false;
    }

    showAssignEmployeeSection(caseId) {
        // need to restrict to managers only
        if (this.case.deadline == null) {
            this.deadlineToSetMessage = true;
            return;
        }
        this.deadlineToSetMessage = false;
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
            console.log(this.allSkillsHeadings);
            // initialize each skill in each user as null so it is used/displayed in the html
            for (var u = 0; u < this.usersWithSkills.length; u++) {
                for (var i = 0; i < this.allSkillsHeadings.length; i++) {
                    //this.usersWithSkills[u][this.allSkillsHeadings[i]] = null; // if Object for skills not used
                    var pair = { [this.allSkillsHeadings[i]]: null };
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

            console.log(this.usersWithSkills);

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
        // add filters later: skillType - need to put on html
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
        // add filters later: skillType - need to put on html
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
        // add filters later: skillType - need to put on html
        this.casesService.getUsersByRoleBySkill("employee", this.skillFilter, this.sortProperty, this.sortAsc, page, this.searchModel.skillSearch).subscribe(result => {
            this.usersP = result;
            this.users = this.usersP.users;
            this.populateUsersListWithSkills();
            this.pageIndex = this.usersP.pageIndex;
            this.setPagination();
        }, errors => this.errorMsg = errors);
    }


}

interface IMessageModel {
    //id: number;
    comment: string;
}

interface IEstHoursModel {
    estimatedTimeHours: number;
}

interface IHoursSpentModel {
    timeSpentHours: number;
}

interface IDeadlineModel {
    deadline: Date;
}

// used in employee assignment
interface searchModel {
    skillSearch: string;
}
