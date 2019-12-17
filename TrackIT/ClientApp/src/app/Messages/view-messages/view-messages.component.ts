import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CasesService, IMessages } from '../../Cases/_services/cases.service';

@Component({
  selector: 'app-view-messages',
  templateUrl: './view-messages.component.html',
  styleUrls: ['./view-messages.component.css']
})
export class ViewMessagesComponent implements OnInit {

    @Input() caseId: string; //caseId is a number
    @Input() caseUserId: string;
    @Input() isEmployee: boolean;

    private errorMsg: any;
    private message: IMessages = { comment: "", userId: "", caseId: null, isEmployee: true, timeStamp: null };
    private messageModel: MessageModel = { comment: "" };
    private messages: Array<IMessages>;
    private showMessages: boolean = false;
    private showHide: string = "\u21E9"; // "Show" down arrow

    constructor(private casesService: CasesService) { }

    ngOnInit() {
        this.casesService.getCaseMessages(this.caseId).subscribe(result => {
            this.messages = result;
        }, errors => this.errorMsg = errors);
    }

    onSubmitMessage(messageForm) {
        this.message = { comment: this.messageModel.comment, userId: this.caseUserId, caseId: parseInt(this.caseId), isEmployee: this.isEmployee, timeStamp: null };
        this.casesService.addCaseMessage(this.message).subscribe(result => {
            this.message.timeStamp = new Date();
            this.messages.push(this.message);
            this.errorMsg = null;
            this.showMessages = true;
            this.showHide = "\u21E7"; // "Show" up arrow
        }, errors => this.errorMsg = errors);
        messageForm.reset(); // or messageForm.resetForm();
    }


    toggleShowMessages() {
        this.showMessages = !this.showMessages;
        this.showHide = this.showMessages ? "\u21E7" : "\u21E9"; // "Hide" up arrow, "Show" down arrow
    }

}

interface MessageModel {
    //id: number;
    comment: string;
}

