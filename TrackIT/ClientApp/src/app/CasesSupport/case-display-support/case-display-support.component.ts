import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, ICases, IUsersPagination, IUser, CaseType, CaseStatus } from '../../Cases/_services/cases.service';
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
    private case: ICases; // change to ICases (had to add several new properties to the interface) 
    private userRole: any; // not sure if I can use a type for this
    private id: string;
    private assignedStaff: Array<string> = []; // this method's version
    private users: IUser; // used to hold just the users (excluding pagination properties)
    private usersP: IUsersPagination;
    private isUserContact: boolean = false;
    private isUserDeveloper: boolean = false;
    private userId: string;
    private estHoursEntry: boolean = false;
    private hoursSpentEntry: boolean = false;
    private estHoursModel: IEstHoursModel = { estimatedTimeHours: 0 };
    private hoursSpentModel: IHoursSpentModel = { timeSpentHours: 0 };
    private deadlineModel: IDeadlineModel = { deadline: new Date() };
    private deadlineToSetMessage: boolean = false;

    // pagination sort/filter/search properties:
    private sortProperty: string = "";
    private sortAsc: boolean = true;

    // pagination properties:
    private pageIndex: number;
    private pagesBefore: Array<number> = [];
    private pagesAfter: Array<number> = [];
    private maxPagesEitherSide: number = 4;

    private CaseTypeEnum = CaseType;
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
        this.casesService.getCase(this.id).subscribe(result => {
            this.case = result;
            this.assignedStaff = this.case.staffAssigned ? this.case.staffAssigned.split(', ') : []; 
            this.authorize.getUser().pipe(map(u => u && u.userId)).subscribe( 
                userId => {
                    this.userId = userId;
                    this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false;
                    this.isUserContact = this.case.contactId == this.userId ? true : false;
            });

        }, errors => this.errorMsg = errors);

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    getAssignedStaff(assignedStaff: Array<string>) {
        this.assignedStaff = assignedStaff;
        this.isUserDeveloper = this.assignedStaff.includes(this.userId) ? true : false; 
        this.isUserContact = this.case.contactId == this.userId ? true : false;
    }

    getCase(caseCopy: any) {
        this.case = caseCopy;
    }

    getDeadlineToSetMessage(deadlineToSetMessage: boolean) {
        this.deadlineToSetMessage = deadlineToSetMessage;
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
        if (this.case.status == this.CaseStatusEnum.Assigned) { 
            this.case.status = this.CaseStatusEnum.AwaitingCustomer;
            this.updateCase(awaitCustForm);
        } else {
            if (this.case.status == this.CaseStatusEnum.AwaitingCustomer) {
                this.case.status = this.CaseStatusEnum.Assigned;
                this.updateCase(awaitCustForm);
            }
        }
    }

    onSubmitComplete(completeForm) {
        if (this.case.status == this.CaseStatusEnum.Complete) {
            this.case.status = this.CaseStatusEnum.Assigned;
            this.case.dateCompleted = null;
            this.updateCase(completeForm);
        } else {
            if (this.case.status != this.CaseStatusEnum.Complete) {
                this.case.status = this.CaseStatusEnum.Complete;
                this.case.dateCompleted = new Date();
                this.updateCase(completeForm);
            }
        }
    }

    onSubmitOnHold(onHoldForm) {
        if (this.case.status == this.CaseStatusEnum.OnHold) {
            this.case.status = this.CaseStatusEnum.Assigned;
            this.updateCase(onHoldForm);
        } else {
            if (this.case.status <= this.CaseStatusEnum.AwaitingCustomer) {
                this.case.status = this.CaseStatusEnum.OnHold;
                this.updateCase(onHoldForm);
            }
        }
    }

    onSubmitCancel(cancelled: boolean) {
        if (cancelled) {
            this.case.status = this.CaseStatusEnum.Cancelled;
        } else {
            this.case.status = this.case.staffAssigned ? this.case.status = this.CaseStatusEnum.Assigned : this.case.status = this.CaseStatusEnum.Opened;
        }
        this.updateCase();
    }

    submitFix() {
        this.case.status = this.CaseStatusEnum.AwaitingApproval;
        this.case.dateAwaitApproval = new Date();
        this.updateCase();
    }

    submitFixApproval() {
        this.case.status = this.CaseStatusEnum.FixApproved;
        this.case.dateApproved = new Date();
        this.updateCase();
    }

    submitFixApplied() {
        this.case.status = this.CaseStatusEnum.Complete;
        this.case.dateApplied = new Date();
        this.case.dateCompleted = new Date();
        this.updateCase();
    }

    updateCase(form = null) {
        this.casesService.updateCase(this.case).subscribe(result => {
        }, errors => this.errorMsg = errors);
        if (form) form.reset();
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
