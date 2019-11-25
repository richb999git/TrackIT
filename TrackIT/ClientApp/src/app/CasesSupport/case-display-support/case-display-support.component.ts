import { Component, OnInit } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares } from '../../Cases/_services/cases.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-case-display-support',
  templateUrl: './case-display-support.component.html',
  styleUrls: ['./case-display-support.component.css']
})
export class CaseDisplaySupportComponent implements OnInit {

    public case: any;
    public id: string;
    public assignedStaff: Array<string> = [];
    public assignedStaffNames: Array<string> = [];
    public assignedStaffNames2: Array<string> = [];
    public users: any;
    public assignStaffFlag: boolean = false;
    public userRole: any;
    public messages: Array<IMessages>;
    public message: IMessages = { comment: "", userId: "", caseId: null, isEmployee: true, timeStamp: null }; // any = {};
    private messageModel: IMessageModel = { comment: "" };
    public errorMsg;
    public isUserContact: boolean = false;
    public isUserDeveloper: boolean = false;
    public userId: any;
    public estHoursEntry: boolean = false;
    public hoursSpentEntry: boolean = false;
    public estHoursModel: IEstHoursModel = { estimatedTimeHours: 0 };
    public hoursSpentModel: IHoursSpentModel = { timeSpentHours: 0 };
    public deadlineModel: IDeadlineModel = { deadline: null };

    constructor(private casesService: CasesService, private _route: ActivatedRoute, private router: Router, private authorize: AuthorizeService) {
        this.id = _route.snapshot.paramMap.get("id");
    }

    ngOnInit() {
        this.casesService.getUsers("employee").subscribe(result => {
            console.log(result);
            this.users = result;

            this.casesService.getCase(this.id).subscribe(result => {
                this.case = result;
                console.log(result);
                this.assignedStaff = this.case.staffAssigned ? this.case.staffAssigned.split(', ') : [];
                this.populateAssignedStaffNames();
                console.log(this.case.deadline);
                this.authorize.getUser().pipe(map(u => u && u.userId)).subscribe(
                    userId => {
                        this.userId = userId;
                        this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
                        this.isUserContact = this.case.contactId == this.userId ? true : false;
                    });

            }, error => console.error(error));

            this.casesService.getCaseMessages(this.id).subscribe(result => {
                this.messages = result;
            }, error => console.error(error));

        }, error => console.error(error));

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    onSubmitMessage(messageForm) {
        this.message.comment = this.messageModel.comment;
        this.message.isEmployee = false;
        this.message.userId = this.case.userId;
        this.message.caseId = this.case.id;
        //this.message.timeStamp = new Date().toISOString();
        this.message.timeStamp = null;

        this.casesService.addCaseMessage(this.message).subscribe(result => {
            messageForm.reset(); // or messageForm.resetForm();
            this.message.timeStamp = new Date();
            this.messages.push(this.message);
        }, errors => {
            console.log(errors);
            if (errors.status === 400) {
                this.errorMsg = errors.error.errors;
            } else {
                this.errorMsg = "Server error";
            }
        });
        messageForm.reset(); // or messageForm.resetForm();
    }

    assignEmployee(id: string) {
        // add or subtract employee to/from staff assigned to case list unless already on the list
        if (this.assignedStaff.includes(id)) {
            this.assignedStaff = this.assignedStaff.filter(e => e !== id);
        } else {
            this.assignedStaff.push(id);
        }
        this.populateAssignedStaffNames(); 
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

        this.populateAssignedStaffNames();
        this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
        this.isUserContact = this.case.contactId == this.userId ? true : false;
    }

    showAssignEmployeeSection(caseId) {
        // need to restrict to managers only
        this.assignStaffFlag = true;
    }

    getUserNameFromId(id) {
        var name = "";
        var user = this.users.filter(u => u.userId == id)
        if (user != []) {
            name = user[0].firstName + " " + user[0].lastName;
        }
        return name;
    }

    populateAssignedStaffNames() {
        this.assignedStaffNames = [];
        for(var person of this.assignedStaff) {
            this.assignedStaffNames.push(this.getUserNameFromId(person));
        }           
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

    updateCase(form = null) {
        this.casesService.updateCase(this.case).subscribe(result => { // PUT and model?
        }, errors => {
            if (errors.status === 400) {
                this.errorMsg = errors.error.errors; // need to put errors at the top of the screen
            } else {
                this.errorMsg = "Server error";
            }
        });
        if (form) form.reset(); // or form.resetForm();
    }

    onSubmitDeadline(setDeadlineForm) {
        this.case.deadline = this.deadlineModel.deadline;
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
}

interface ICaseAssignedModel {
    id: number;
    staffAssigned: string;
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
