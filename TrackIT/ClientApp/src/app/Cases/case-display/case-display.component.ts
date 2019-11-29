import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares } from '../_services/cases.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-display',
  templateUrl: './case-display.component.html',
  styleUrls: ['./case-display.component.css']
})
export class CaseDisplayComponent implements OnInit {
    public case: ICases;
    public id: string;
    public messages: Array<IMessages>;
    public message: IMessages = {comment: "", userId: "", caseId: null, isEmployee: true, timeStamp: null}; // any = {};
    private messageModel: MessageModel = { comment: ""};
    public errorMsg: any;

    constructor(private casesService: CasesService, private _route: ActivatedRoute, private elementRef: ElementRef) {
        // For a static snapshot of the route...
        this.id = _route.snapshot.paramMap.get("id"); // preferred way to get param
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getCase(this.id).subscribe(result => {
            this.case = result;
            console.log(this.case);
        }, error => console.error(error));

        this.casesService.getCaseMessages(this.id).subscribe(result => {
            this.messages = result;
            console.log(this.messages);
        }, error => console.error(error));
    }

    onSubmitMessage(messageForm) {
        this.message = { comment: this.messageModel.comment, userId: this.case.userId, caseId: this.case.id, isEmployee: false, timeStamp: null };
        this.casesService.addCaseMessage(this.message).subscribe(result => {
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

}

interface MessageModel {
    //id: number;
    comment: string;
}
